/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Package,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { cn } from "cn";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { formatBRL, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/lib/order-status";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        setIsLoading(true);
        setNotFound(false);

        const [orderData, productsData] = await Promise.all([
          orderService.getById(id),
          productService.getAll(),
        ]);

        if (!isMounted) return;
        setOrder(orderData);
        setProducts(productsData);
      } catch (err) {
        console.error("Erro ao carregar pedido:", err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (id) loadOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-(--barro) animate-spin" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <main className="px-4 sm:px-8 lg:px-20 py-20 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-carvao">
          Pedido não encontrado.
        </h2>
        <Link href="/dashboard" className="text-(--barro) underline inline-block">
          Voltar para o painel
        </Link>
      </main>
    );
  }

  const productById = new Map(products.map((p) => [String(p.id), p]));
  const isCancelled = order.status === "cancelled";

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-6 sm:py-8 max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-stone-600 hover:text-carvao text-sm w-fit transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para o painel
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 text-center space-y-3">
          {isCancelled ? (
            <XCircle className="w-14 h-14 text-(--urucum) mx-auto" />
          ) : (
            <CheckCircle2 className="w-14 h-14 text-(--mangue) mx-auto" />
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-carvao">
            {isCancelled ? "Pedido cancelado" : "Pedido confirmado!"}
          </h1>
          <p className="text-sm text-stone-600">
            {isCancelled
              ? `O pedido #${order.id} foi cancelado.`
              : `Obrigado, ${order.customerName}! Seu pedido #${order.id} foi registrado.`}
          </p>
          <p className="text-xs text-stone-500">
            {formatDateTime(order.createdAt)}
          </p>
        </CardContent>
      </Card>

      {!isCancelled && (
        <Card>
          <CardContent className="p-5 sm:p-6">
            <StatusTracker current={order.status} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Itens do pedido</CardTitle>
          <CardDescription>
            Enviado para {order.customerEmail}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item, idx) => {
            const product = productById.get(String(item.productId));
            return (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-md overflow-hidden border shrink-0 bg-stone-100">
                  {product ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-stone-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-carvao line-clamp-1">
                    {product ? (
                      <Link
                        href={`/produtos/${item.productId}`}
                        className="hover:underline"
                      >
                        {product.name}
                      </Link>
                    ) : (
                      `Produto #${item.productId}`
                    )}
                  </p>
                  <p className="text-xs text-stone-500">
                    Qtd. {item.quantity} · {formatBRL(item.unitPrice)} / un.
                  </p>
                </div>
                <span className="text-sm font-bold text-carvao shrink-0">
                  {formatBRL(item.unitPrice * item.quantity)}
                </span>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-4 border-t text-base font-bold">
            <span>Total</span>
            <span className="text-(--barro)">
              {formatBRL(order.totalAmount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          render={<Link href="/dashboard" />}
          variant="outline"
          className="flex-1 py-4 cursor-pointer"
        >
          Ver meus pedidos
        </Button>
        <Button
          render={<Link href="/produtos" />}
          className="flex-1 py-4 cursor-pointer flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Continuar comprando
        </Button>
      </div>
    </main>
  );
}

function StatusTracker({ current }: { current: Order["status"] }) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(current);

  return (
    <div className="flex items-center justify-between">
      {ORDER_STATUS_FLOW.map((status, idx) => {
        const isDone = idx <= currentIndex;
        return (
          <div key={status} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={cn(
                  "w-3.5 h-3.5 rounded-full border-2",
                  isDone
                    ? "bg-(--barro) border-(--barro)"
                    : "bg-white border-stone-300",
                )}
              />
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium text-center",
                  isDone ? "text-carvao" : "text-stone-400",
                )}
              >
                {ORDER_STATUS_LABEL[status]}
              </span>
            </div>
            {idx < ORDER_STATUS_FLOW.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 -mt-5",
                  idx < currentIndex ? "bg-(--barro)" : "bg-stone-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
