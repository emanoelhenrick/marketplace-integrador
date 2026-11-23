"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/role-guard";

import { ToggleUserModal } from "@/app/admin/users/_components/toggle-user-modal";
import { PageLoading, PageMessage } from "@/components/common/page-state";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { ACCESS, allowRoles } from "@/lib/permissions";
import type { AdminUser } from "@/types/admin";
import { UsersTable } from "./_components/users-table";

function UsersContent() {
  const { users, isLoading, error, busyId, canToggle, toggleActive } = useAdminUsers();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  if (isLoading) return <PageLoading />;
  if (error) return <PageMessage title="Não foi possível carregar os usuários" description={error.message} />;

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;
    await toggleActive(selectedUser);
    setSelectedUser(null);
  };

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Usuários</h1>
        <p className="text-sm text-muted-foreground">
          Desativar uma conta bloqueia o acesso, mas preserva pedidos e avaliações.
        </p>
      </div>

      <UsersTable
        users={users}
        busyId={busyId}
        canToggle={canToggle}
        onToggle={setSelectedUser}
      />

      <ToggleUserModal
        user={
          selectedUser
            ? {
                id: String(selectedUser.id),
                name: selectedUser.name,
                email: selectedUser.email,
                active: selectedUser.active ?? true,
              }
            : null
        }
        isBusy={selectedUser ? busyId === String(selectedUser.id) : false}
        onClose={() => setSelectedUser(null)}
        onConfirm={handleConfirmToggle}
      />
    </main>
  );
}

export default function AdminUsersPage() {
  return (
    <RoleGuard allow={allowRoles(ACCESS.admin)} forbiddenTitle="Área restrita à administração">
      <UsersContent />
    </RoleGuard>
  );
}