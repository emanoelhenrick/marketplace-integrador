"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageLoading, PageMessage } from "@/components/common/page-state";
import { useSession } from "@/hooks/use-session";
import { getHomeRoute } from "@/lib/permissions";
import type { UserRole } from "@/types/user";

interface RoleGuardProps {
  allow: UserRole[];
  loginTitle?: string;
  loginDescription?: string;
  forbiddenTitle?: string;
  forbiddenDescription?: string;
  children: ReactNode;
}

export function RoleGuard({
  allow,
  loginTitle = "Você precisa entrar para continuar",
  loginDescription = "Entre com a sua conta para acessar esta página.",
  forbiddenTitle = "Você não tem acesso a esta página",
  forbiddenDescription = "Seu perfil não possui permissão para ver este conteúdo.",
  children,
}: RoleGuardProps) {
  const { ready, role } = useSession();
  const pathname = usePathname();

  if (!ready) return <PageLoading />;

  if (!role) {
    return (
      <PageMessage
        icon={CircleUserRound}
        title={loginTitle}
        description={loginDescription}
      >
        <Button
          render={<Link href={`/login?redirect=${encodeURIComponent(pathname)}`} />}
          className="py-4 px-8 cursor-pointer"
        >
          Ir para o login
        </Button>
      </PageMessage>
    );
  }

  if (!allow.includes(role)) {
    return (
      <PageMessage
        icon={ShieldAlert}
        title={forbiddenTitle}
        description={forbiddenDescription}
      >
        <Button
          render={<Link href={getHomeRoute(role)} />}
          variant="outline"
          className="py-4 px-8 cursor-pointer"
        >
          Voltar
        </Button>
      </PageMessage>
    );
  }

  return <>{children}</>;
}
