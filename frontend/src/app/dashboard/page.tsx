"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { PageLoading, PageMessage } from "@/components/common/page-state";
import { AdminDashboard } from "@/components/cards/AdminDashboard";
import { ArtisanDashboard } from "@/components/cards/ArtisanDashboard";
import { ClientDashboard } from "@/components/cards/ClientDashboard";
import { useDashboardData } from "@/hooks/useDashboardData";

const COPY = {
  admin: {
    title: "Visão geral da plataforma",
    subtitle: "Acompanhe pedidos, produtos e artesãos cadastrados na Manoa.",
  },
  artisan: {
    title: "Minhas vendas",
    subtitle: "Acompanhe o desempenho das suas peças e os pedidos recebidos.",
  },
  client: {
    title: "Seus pedidos",
    subtitle: "Acompanhe o status e o histórico das suas compras.",
  },
} as const;

function DashboardContent() {
  const {
    user,
    role,
    isLoading,
    error,
    products,
    artisans,
    clientData,
    artisanData,
    adminData,
  } = useDashboardData();

  if (!user || !role) return <PageLoading />;
  if (isLoading) return <PageLoading label="Carregando seu painel..." />;
  if (error) return <PageMessage title="Ops, algo deu errado" description={error} />;

  const copy = COPY[role];

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-2 sm:py-4 space-y-8">
      <div>
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Painel</p>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {role === "artisan" ? `${copy.title} · ${user.name}` : copy.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{copy.subtitle}</p>
      </div>

      {role === "admin" && adminData && (
        <AdminDashboard
          data={adminData}
          totalProducts={products.length}
          totalArtisans={artisans.length}
        />
      )}
      {role === "artisan" && artisanData && <ArtisanDashboard data={artisanData} />}
      {role === "client" && clientData && <ClientDashboard data={clientData} />}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RoleGuard
      allow={["client", "artisan", "admin"]}
      loginTitle="Você precisa entrar para ver seu painel"
      loginDescription="Entre com sua conta para acompanhar pedidos, vendas e o desempenho do seu acervo na Manoa."
    >
      <DashboardContent />
    </RoleGuard>
  );
}
