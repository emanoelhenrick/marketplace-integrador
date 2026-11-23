"use client";

import { Button } from "@/components/ui/button";
import type { ModerationDecision } from "@/types/admin";
import type { Id, ModerationStatus } from "@/types/common";

export interface ModerationRow {
  id: Id;
  title: string;
  subtitle: string;
  status: ModerationStatus;
}

const LABEL: Record<ModerationStatus, string> = { pending: "Pendente", approved: "Aprovado", rejected: "Reprovado" };

interface ModerationListProps {
  title: string;
  kind: "product" | "artisan";
  rows: ModerationRow[];
  busyId: string | null;
  onDecide: (id: Id, decision: ModerationDecision) => void;
}

export function ModerationList({ title, kind, rows, busyId, onDecide }: ModerationListProps) {
  return (
    <section className="space-y-3" aria-label={title}>
      <h2 className="text-xl font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nada para moderar.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => {
            const busy = busyId === `${kind}:${row.id}`;
            return (
              <li key={row.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-md p-3 bg-card">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{row.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.subtitle} · <strong>{LABEL[row.status]}</strong>
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" disabled={busy || row.status === "approved"} onClick={() => onDecide(row.id, { status: "approved" })} className="cursor-pointer">
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy || row.status === "rejected"}
                    onClick={() => onDecide(row.id, { status: "rejected" })}
                    className="cursor-pointer"
                  >
                    Reprovar
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
