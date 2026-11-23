"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isStockConflict, parseApiError } from "@/lib/api-error";
import { cartTotals, findStockIssues, type StockIssue } from "@/lib/cart";
import { toast } from "@/lib/toast";
import { formatPhone, formatZipCode } from "@/lib/text";
import { EMPTY_ADDRESS, normalizeAddress, validateAddress, type FieldErrors } from "@/lib/validation";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { useSession } from "@/hooks/use-session";
import { useCartStore } from "@/store/cardStore";
import type { CartItem, Product } from "@/types/product";
import type { PaymentMethod, ShippingAddress } from "@/types/order";

const STOCK_POLL_MS = 15_000;

function issuesFromConflict(items: CartItem[], stockItems: { productId: number | string; available: number }[]): StockIssue[] {
  const availability = new Map(stockItems.map((s) => [String(s.productId), s.available]));
  return items
    .filter((i) => availability.has(String(i.product.id)))
    .map((i) => {
      const available = Math.max(0, availability.get(String(i.product.id)) ?? 0);
      return {
        productId: i.product.id,
        name: i.product.name,
        requested: i.quantity,
        available,
        kind: available <= 0 ? ("out_of_stock" as const) : ("insufficient" as const),
      };
    });
}

export function useCheckout() {
  const router = useRouter();
  const { user } = useSession();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const syncWithCatalog = useCartStore((s) => s.syncWithCatalog);

  const [address, setAddress] = useState<ShippingAddress>(() => ({
    ...EMPTY_ADDRESS,
    recipientName: user?.name ?? "",
    phone: user?.phone ? formatPhone(user.phone) : "",
  }));
  const [errors, setErrors] = useState<FieldErrors<ShippingAddress>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [issues, setIssues] = useState<StockIssue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submittingRef = useRef(false);
  const idempotencyKeyRef = useRef<string | null>(null);
  const lastFreshRef = useRef<Product[]>([]);
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const totals = useMemo(() => cartTotals(items), [items]);

  /** Consulta o estoque atual e atualiza os bloqueios. Falha de rede não bloqueia, mas o servidor revalida. */
  const refreshStock = useCallback(async (): Promise<StockIssue[]> => {
    const current = itemsRef.current;
    if (current.length === 0) {
      setIssues([]);
      return [];
    }
    try {
      const fresh = await productService.getByIds(current.map((i) => i.product.id));
      lastFreshRef.current = fresh;
      const found = findStockIssues(current, fresh);
      setIssues(found);
      return found;
    } catch {
      return [];
    }
  }, []);

  // Bloqueio imediato: confere ao abrir, a cada 15 s e quando a aba volta ao foco.
  useEffect(() => {
    void refreshStock();
    const interval = setInterval(() => void refreshStock(), STOCK_POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && void refreshStock();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshStock, items.length]);

  const setField = (field: keyof ShippingAddress, value: string) => {
    const formatted = field === "zipCode" ? formatZipCode(value) : field === "phone" ? formatPhone(value) : value;
    setAddress((prev) => ({ ...prev, [field]: field === "state" ? formatted.toUpperCase() : formatted }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  /** Ajusta o carrinho ao estoque real (aparando quantidades e removendo esgotados). */
  const resolveIssues = async () => {
    let fresh = lastFreshRef.current;
    try {
      fresh = await productService.getByIds(itemsRef.current.map((i) => i.product.id));
    } catch {
      /* usa o último snapshot conhecido */
    }
    syncWithCatalog(fresh);
    setIssues([]);
    toast.info("Carrinho ajustado ao estoque disponível");
  };

  const submit = async () => {
    if (submittingRef.current || !user) return;
    setError(null);

    const addressErrors = validateAddress(address);
    setErrors(addressErrors);
    if (Object.keys(addressErrors).length > 0) {
      setError("Revise os campos de entrega destacados.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const found = await refreshStock();
      if (found.length > 0) {
        setError("Alguns itens ficaram indisponíveis. Ajuste o carrinho para continuar.");
        return;
      }

      idempotencyKeyRef.current ??= crypto.randomUUID();
      const order = await orderService.create(
        {
          items: itemsRef.current.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          shippingAddress: normalizeAddress(address),
          paymentMethod,
        },
        idempotencyKeyRef.current,
      );

      idempotencyKeyRef.current = null;
      clearCart();
      toast.success(`Pedido #${order.id} realizado!`, { description: "Acompanhe o status em Meus pedidos." });
      router.replace(`/order/${order.id}?novo=1`);
    } catch (err) {
      const info = parseApiError(err, "Não foi possível registrar o pedido. Tente novamente.");

      // Só mantém a chave em falha de rede (retry seguro); nos demais casos o próximo envio é um novo pedido.
      if (info.code !== "NETWORK_ERROR") idempotencyKeyRef.current = null;

      if (isStockConflict(info)) {
        // Outra compra levou o estoque durante o checkout.
        const conflict = info.stockItems ? issuesFromConflict(itemsRef.current, info.stockItems) : [];
        setIssues(conflict);
        if (conflict.length === 0) await refreshStock();
        setError("O estoque mudou enquanto você finalizava. Nenhum pedido foi criado.");
        toast.error("Estoque insuficiente", { description: "Ajuste o carrinho e tente novamente." });
      } else if (info.fieldErrors) {
        setErrors(info.fieldErrors as FieldErrors<ShippingAddress>);
        setError(info.message);
      } else {
        setError(info.message);
        toast.error("Falha ao finalizar o pedido", { description: "Seu carrinho foi mantido." });
      }
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    user,
    items,
    totals,
    address,
    setField,
    errors,
    paymentMethod,
    setPaymentMethod,
    issues,
    isBlocked: issues.length > 0,
    resolveIssues,
    error,
    isSubmitting,
    submit,
  };
}
