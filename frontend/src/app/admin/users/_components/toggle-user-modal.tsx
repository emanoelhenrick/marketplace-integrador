"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TargetUser {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

interface ToggleUserModalProps {
  user: TargetUser | null;
  isBusy: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ToggleUserModal({ user, isBusy, onClose, onConfirm }: ToggleUserModalProps) {
  if (!user) return null;

  const isDeactivating = user.active;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg space-y-4">
        <div className="flex items-start gap-3">
          {isDeactivating ? (
            <div className="rounded-full bg-destructive/10 p-2 text-destructive shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
          ) : (
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}

          <div className="space-y-1">
            <h2 id="modal-title" className="text-lg font-semibold leading-none">
              {isDeactivating ? "Desativar conta de usuário?" : "Reativar conta de usuário?"}
            </h2>
            <p className="text-sm text-muted-foreground pt-1">
              {isDeactivating ? (
                <>
                  Você está prestes a bloquear o acesso de <strong className="text-foreground">{user.name}</strong> ({user.email}). O histórico de pedidos e avaliações será mantido.
                </>
              ) : (
                <>
                  Você está prestes a restaurar o acesso de <strong className="text-foreground">{user.name}</strong> ({user.email}) à plataforma Manoa.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant={isDeactivating ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isBusy}
            className={!isDeactivating ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
          >
            {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeactivating ? "Sim, desativar" : "Sim, ativar"}
          </Button>
        </div>
      </div>
    </div>
  );
}