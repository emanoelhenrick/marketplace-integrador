"use client";

import { RoleGuard } from "@/components/auth/role-guard";

import { PageLoading, PageMessage } from "@/components/common/page-state";
import { useAdminCuration } from "@/hooks/use-admin-curation";
import { ACCESS, allowRoles } from "@/lib/permissions";
import { ModerationList } from "./_components/moderation-list";

function CurationContent() {
  const c = useAdminCuration();
  if (c.isLoading) return <PageLoading />;
  if (c.error) return <PageMessage title="Não foi possível carregar a curadoria" description={c.error.message} />;

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Curadoria</h1>
        <p className="text-sm text-muted-foreground">Só produtos e perfis aprovados aparecem publicamente.</p>
      </div>
      <ModerationList
        title="Produtos"
        kind="product"
        busyId={c.busyId}
        onDecide={c.moderateProduct}
        rows={c.products.map((p) => ({ id: p.id, title: p.name, subtitle: p.category, status: p.moderationStatus ?? "approved" }))}
      />
      <ModerationList
        title="Perfis de artesãos"
        kind="artisan"
        busyId={c.busyId}
        onDecide={c.moderateArtisan}
        rows={c.artisans.map((a) => ({ id: a.id, title: a.name, subtitle: a.craft, status: a.moderationStatus ?? "approved" }))}
      />
    </main>
  );
}

export default function AdminCurationPage() {
  return (
    <RoleGuard allow={allowRoles(ACCESS.admin)} forbiddenTitle="Área restrita à administração">
      <CurationContent />
    </RoleGuard>
  );
}
