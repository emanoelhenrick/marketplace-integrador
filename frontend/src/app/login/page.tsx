"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, ShieldAlert, Loader2, Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/common/page-state";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useSession } from "@/hooks/use-session";
import { getHomeRoute, safeRedirect } from "@/lib/permissions";
import { toast } from "@/lib/toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const { ready, isAuthenticated, role } = useSession();

  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quem já está logado não deve ver o formulário de login.
  useEffect(() => {
    if (ready && isAuthenticated && !isLoading) {
      router.replace(safeRedirect(redirectParam, getHomeRoute(role)));
    }
  }, [ready, isAuthenticated, isLoading, role, redirectParam, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await authService.login({ email: email.trim(), password });
      login(user);
      toast.success(`Bem-vindo(a), ${user.name.split(" ")[0]}!`, {
        description: "Login realizado com sucesso.",
      });
      router.push(safeRedirect(redirectParam, getHomeRoute(user.role)));
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("senha")
          ? err.message
          : "Não foi possível entrar. Verifique sua conexão e tente novamente.",
      );
      setIsLoading(false);
    }
  };

  if (!ready || isAuthenticated) return <PageLoading />;

  return (
    <main className="flex justify-center px-4 sm:px-6 py-2 sm:py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Entrar na Manoa</CardTitle>
          <CardDescription>
            {redirectParam
              ? "Entre na sua conta para continuar de onde parou."
              : "Acesse sua conta para comprar peças ou, se você for artesão, gerenciar seu ateliê."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="py-4"
                disabled={isLoading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="py-4 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {error && (
              <FieldError role="alert" className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </FieldError>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-4 font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Entrar
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Só quer olhar as peças?{" "}
            <Link href="/produtos" className="text-brand font-semibold hover:underline">
              Continue navegando como visitante
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  // useSearchParams exige Suspense no build do Next.
  return (
    <Suspense fallback={<PageLoading />}>
      <LoginForm />
    </Suspense>
  );
}
