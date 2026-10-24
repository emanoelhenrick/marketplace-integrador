"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { nextOrderStatus, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { toast } from "@/lib/toast";
import { orderService } from "@/services/orderService";
import type { Order, OrderStatus } from "@/types/order";

interface ActionProps {
  order: Order;
  onUpdated: (order: Order) => void;
}

/** Executa uma ação assíncrona com estado de "ocupado" e toast de sucesso/erro. */
function useOrderAction(onUpdated: (order: Order) => void) {
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<Order>, successTitle: string, successDescription?: string) => {
    setBusy(true);
    try {
      const updated = await action();
      onUpdated(updated);
      toast.success(successTitle, { description: successDescription });
    } catch (err) {
      console.error("Erro ao atualizar pedido:", err);
      toast.error("Não foi possível atualizar o pedido", { description: "Tente novamente em instantes." });
    } finally {
      setBusy(false);
    }
  };

  return { busy, run };
}

function ConfirmCancel({ busy, onConfirm, label }: { busy: boolean; onConfirm: () => void; label: string }) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button
        variant="destructive"
        onClick={() => setAsking(true)}
        disabled={busy}
        className="py-4 cursor-pointer flex items-center gap-2"
      >
        <XCircle className="w-4 h-4" /> {label}
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2" role="group" aria-label="Confirmar cancelamento">
      <span className="text-sm text-muted-foreground">Tem certeza? Esta ação não pode ser desfeita.</span>
      <div className="flex gap-2">
        <Button variant="destructive" onClick={onConfirm} disabled={busy} className="cursor-pointer">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sim, cancelar"}
        </Button>
        <Button variant="outline" onClick={() => setAsking(false)} disabled={busy} className="cursor-pointer">
          Manter pedido
        </Button>
      </div>
    </div>
  );
}

/** Cliente: pode cancelar enquanto o pagamento ainda não foi confirmado. */
export function ClientOrderActions({ order, onUpdated }: ActionProps) {
  const { busy, run } = useOrderAction(onUpdated);
  if (order.status !== "pending") return null;

  return (
    <Card>
      <CardContent className="p-5">
        <ConfirmCancel
          busy={busy}
          label="Cancelar pedido"
          onConfirm={() => run(() => orderService.updateStatus(order.id, "cancelled"), `Pedido #${order.id} cancelado`)}
        />
      </CardContent>
    </Card>
  );
}

/** Administrador: avança o status ou cancela. */
export function AdminOrderActions({ order, onUpdated }: ActionProps) {
  const { busy, run } = useOrderAction(onUpdated);
  const next = nextOrderStatus(order.status);
  const canCancel = order.status !== "cancelled" && order.status !== "delivered";

  if (!next && !canCancel) return null;

  const change = (status: OrderStatus) =>
    run(
      () => orderService.updateStatus(order.id, status),
      `Pedido #${order.id} atualizado`,
      `Novo status: ${ORDER_STATUS_LABEL[status]}`,
    );

  return (
    <Card>
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <p className="text-sm font-semibold">Gerenciar pedido</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {next && (
            <Button onClick={() => change(next)} disabled={busy} className="py-4 cursor-pointer flex items-center gap-2">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Marcar como {ORDER_STATUS_LABEL[next].toLowerCase()}
            </Button>
          )}
          {canCancel && (
            <ConfirmCancel busy={busy} label="Cancelar pedido" onConfirm={() => change("cancelled")} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/** Artesão: confirma que embalou as peças dele (só com o pedido pago). */
export function ArtisanOrderActions({
  order,
  artisanId,
  onUpdated,
}: ActionProps & { artisanId: number | string }) {
  const { busy, run } = useOrderAction(onUpdated);
  const mine = order.items.filter((i) => String(i.artisanId) === String(artisanId));
  const allPacked = mine.length > 0 && mine.every((i) => i.packed);

  if (order.status === "cancelled") return null;

  if (allPacked || order.status === "shipped" || order.status === "delivered") {
    return (
      <Card>
        <CardContent className="p-5 flex items-center gap-2 text-sm text-forest font-medium">
          <CheckCircle2 className="w-5 h-5" /> Suas peças deste pedido já foram embaladas.
        </CardContent>
      </Card>
    );
  }

  if (order.status === "pending") {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Aguardando a confirmação do pagamento para liberar o preparo e o envio.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <p className="text-sm">Embale suas peças com a caixa reforçada e o selo de autenticidade.</p>
        <Button
          onClick={() =>
            run(
              () => orderService.markItemsPacked(order, artisanId),
              "Peças marcadas como embaladas",
              `Pedido #${order.id}`,
            )
          }
          disabled={busy}
          className="py-4 cursor-pointer flex items-center gap-2"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Confirmar embalado
        </Button>
      </CardContent>
    </Card>
  );
}
