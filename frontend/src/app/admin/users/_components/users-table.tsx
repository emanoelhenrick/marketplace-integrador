"use client";

import { StatusToggle } from "@/components/ui/status-toggle";
import type { AdminUser } from "@/types/admin";

interface UsersTableProps {
  users: AdminUser[];
  busyId: string | null;
  canToggle: (user: AdminUser) => boolean;
  onToggle: (user: AdminUser) => void;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  artisan: "Artesão",
  client: "Cliente",
};

export function UsersTable({ users, busyId, canToggle, onToggle }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Nenhum usuário encontrado.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {users.map((user) => {
          const isBusy = busyId === String(user.id);
          const allowed = canToggle(user);
          const isActive = user.active ?? true;

          return (
            <div
              key={user.id}
              className="rounded-lg border bg-card p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <span className="shrink-0 inline-flex items-center rounded-md border bg-muted/40 px-2 py-0.5 text-xs font-medium">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">Status da conta</span>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-emerald-600" : "text-muted-foreground"
                    }`}
                  >
                    {isActive ? "Ativo" : "Inativo"}
                  </span>
                  <StatusToggle
                    checked={isActive}
                    disabled={!allowed || isBusy}
                    onChange={() => onToggle(user)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visualização Desktop: Tabela completa */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Usuário</th>
              <th className="px-4 py-3 font-medium">Perfil</th>
              <th className="px-4 py-3 font-medium">Status da Conta</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => {
              const isBusy = busyId === String(user.id);
              const allowed = canToggle(user);
              const isActive = user.active ?? true;

              return (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md border bg-muted/40 px-2 py-0.5 text-xs font-medium">
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <StatusToggle
                        checked={isActive}
                        disabled={!allowed || isBusy}
                        onChange={() => onToggle(user)}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isActive ? "text-emerald-600" : "text-muted-foreground"
                        }`}
                      >
                        {isActive ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}