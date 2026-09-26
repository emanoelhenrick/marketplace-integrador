"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ShieldAlert } from "lucide-react";

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
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

const DEMO_ACCOUNTS = [
  { label: "Cliente", email: "joao.silva@email.com", password: "123456" },
  {
    label: "Artesão",
    email: "eudocio@barro.com.br",
    password: "123456",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await authService.login({ email, password });
      login(user);
      router.push(user.role === "artisan" ? "/perfil" : "/produtos");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <main className="flex justify-center px-4 sm:px-6 py-6 sm:py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold text-carvao">
            Entrar na Manoa
          </CardTitle>
          <CardDescription>
            Acesse sua conta para comprar peças ou, se você for artesão,
            cadastrar seus produtos.
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
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="py-4"
              />
            </Field>

            {error && (
              <FieldError className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </FieldError>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="rounded-md bg-(--barro-claro) border p-3.5 space-y-2">
            <p className="text-xs font-semibold text-carvao">
              Contas de demonstração (fake API / db.json)
            </p>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() =>
                    fillDemoAccount(account.email, account.password)
                  }
                  className="text-left text-xs bg-white border rounded px-3 py-2 hover:bg-white/70 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-(--urucum)">
                    {account.label}:
                  </span>{" "}
                  {account.email} · senha {account.password}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link
              href="/produtos"
              className="text-(--barro) font-semibold hover:underline"
            >
              Continue navegando como visitante
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
