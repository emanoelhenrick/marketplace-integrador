"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderMutations } from "@/hooks/use-order-mutations";
import { allowedTransitions, canArtisanPack, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { itemsOfArtisan } from "@/lib/metrics";
import type { Order } from "@/types/order";

interface ActionProps {
  order: Order;
  onUpdated: (order: Order) => void;
}

function ConfirmCancel({ busy, onConfirm, label }: { busy: boolean; onConfirm: () => void; label: string }) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button variant="destructive" onClick={() => setAsking(true)} disabled={busy} className="py-4 cursor-pointer flex items-center gap-2">
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
  const { busy, cancel } = useOrderMutations(order, onUpdated);
  if (!allowedTransitions("client", order.status).includes("cancelled")) return null;

  return (
    <Card>
      <CardContent className="p-5">
        <ConfirmCancel busy={busy} label="Cancelar pedido" onConfirm={cancel} />
      </CardContent>
    </Card>
  );
}

/** Administrador: avança o status ou cancela. */
export function AdminOrderActions({ order, onUpdated }: ActionProps) {
  const { busy, changeStatus } = useOrderMutations(order, onUpdated);
  const options = allowedTransitions("admin", order.status);
  const next = options.find((s) => s !== "cancelled");
  const canCancel = options.includes("cancelled");

  if (options.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <p className="text-sm font-semibold">Gerenciar pedido</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {next && (
            <Button onClick={() => changeStatus(next)} disabled={busy} className="py-4 cursor-pointer flex items-center gap-2">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Marcar como {ORDER_STATUS_LABEL[next].toLowerCase()}
            </Button>
          )}
          {canCancel && <ConfirmCancel busy={busy} label="Cancelar pedido" onConfirm={() => changeStatus("cancelled")} />}
        </div>
      </CardContent>
    </Card>
  );
}

/** Artesão: confirma que embalou as peças dele (só com o pedido pago). */
export function ArtisanOrderActions({ order, artisanId, onUpdated }: ActionProps & { artisanId: number | string }) {
  const { busy, pack } = useOrderMutations(order, onUpdated);
  const mine = itemsOfArtisan(order, artisanId);
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

  if (!canArtisanPack(order.status)) {
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
        <Button onClick={pack} disabled={busy} className="py-4 cursor-pointer flex items-center gap-2">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Confirmar embalado
        </Button>
      </CardContent>
    </Card>
  );
}
