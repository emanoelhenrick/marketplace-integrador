"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserPlus,
  ShieldAlert,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  MapPin,
  User as UserIcon,
  Lock,
} from "lucide-react";

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
import { useRegister } from "@/hooks/use-register";
import { useSession } from "@/hooks/use-session";
import { getHomeRoute, safeRedirect } from "@/lib/permissions";
import { toast } from "@/lib/toast";

// Máscaras simples para campos brasileiros
const formatCPF = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const formatPhone = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");

const formatCEP = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, error, isLoading } = useRegister();
  const { ready, isAuthenticated, role: sessionRole } = useSession();

  const redirectParam = searchParams.get("redirect");
  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  // Tipo de perfil
  const [accountRole, setAccountRole] = useState<"client" | "artisan">("client");

  // Dados pessoais
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  // Senha
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Endereço
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("PE");
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && isAuthenticated && !isLoading) {
      router.replace(safeRedirect(redirectParam, getHomeRoute(sessionRole)));
    }
  }, [ready, isAuthenticated, isLoading, sessionRole, redirectParam, router]);

  // Busca automática de endereço pelo CEP
  const handleCepChange = async (rawValue: string) => {
    const formatted = formatCEP(rawValue);
    setZipCode(formatted);

    const digits = formatted.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setIsFetchingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setStreet(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(data.localidade || "");
        setState(data.uf || "PE");
      }
    } catch {
      // Falha silenciosa: usuário pode preencher manualmente
    } finally {
      setIsFetchingCep(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (cpf.replace(/\D/g, "").length !== 11) {
      setLocalError("Informe um CPF válido com 11 dígitos.");
      return;
    }

    if (password.length < 6) {
      setLocalError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("As senhas não coincidem.");
      return;
    }

    if (zipCode.replace(/\D/g, "").length !== 8) {
      setLocalError("Informe um CEP válido com 8 dígitos.");
      return;
    }

    const user = await register({
      name: name.trim(),
      email: email.trim(),
      cpf: cpf.replace(/\D/g, ""),
      phone: phone.trim(),
      password,
      role: accountRole,
      address: {
        zipCode: zipCode.replace(/\D/g, ""),
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim() || undefined,
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
      },
    });

    if (!user) return;

    toast.success(`Conta criada com sucesso, ${user.name.split(" ")[0]}!`, {
      description: "Bem-vindo(a) à Manoa.",
    });

    router.push(safeRedirect(redirectParam, getHomeRoute(user.role)));
  };

  if (!ready || isAuthenticated) return <PageLoading />;

  const activeError = localError || error;

  return (
    <main className="flex justify-center px-4 sm:px-6 py-4 sm:py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Link
              href={loginHref}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o login
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold pt-1">Criar conta na Manoa</CardTitle>
          <CardDescription>
            Preencha seus dados pessoais e endereço de entrega para comprar peças artesanais ou vender sua arte.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de conta */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountRole("client")}
                className={`p-3 rounded-md border text-left transition-colors cursor-pointer ${
                  accountRole === "client"
                    ? "border-brand bg-brand/5 font-semibold"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <p className="text-sm">Quero comprar</p>
                <p className="text-xs text-muted-foreground font-normal">Conta de cliente</p>
              </button>

              <button
                type="button"
                onClick={() => setAccountRole("artisan")}
                className={`p-3 rounded-md border text-left transition-colors cursor-pointer ${
                  accountRole === "artisan"
                    ? "border-brand bg-brand/5 font-semibold"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <p className="text-sm">Sou artesão(ã)</p>
                <p className="text-xs text-muted-foreground font-normal">Gerenciar meu ateliê</p>
              </button>
            </div>

            {/* Seção 1: Dados Pessoais */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground border-b pb-2">
                <UserIcon className="w-4 h-4 text-brand" /> Dados Pessoais
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria da Silva"
                    disabled={isLoading}
                  />
                </Field>

                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    disabled={isLoading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                  <Input
                    id="cpf"
                    type="text"
                    inputMode="numeric"
                    required
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    disabled={isLoading}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Telefone / WhatsApp</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(81) 99999-9999"
                    disabled={isLoading}
                  />
                </Field>
              </div>
            </section>

            {/* Seção 2: Endereço */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground border-b pb-2">
                <MapPin className="w-4 h-4 text-brand" /> Endereço
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="zipCode">
                    CEP {isFetchingCep && <span className="text-xs text-muted-foreground">(buscando...)</span>}
                  </FieldLabel>
                  <Input
                    id="zipCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    required
                    value={zipCode}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="50000-000"
                    disabled={isLoading}
                  />
                </Field>

                <Field className="sm:col-span-4">
                  <FieldLabel htmlFor="street">Rua / Avenida</FieldLabel>
                  <Input
                    id="street"
                    type="text"
                    autoComplete="street-address"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Nome da rua"
                    disabled={isLoading}
                  />
                </Field>

                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="number">Número</FieldLabel>
                  <Input
                    id="number"
                    type="text"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="123"
                    disabled={isLoading}
                  />
                </Field>

                <Field className="sm:col-span-4">
                  <FieldLabel htmlFor="complement">Complemento (opcional)</FieldLabel>
                  <Input
                    id="complement"
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Apto, bloco, ponto de referência..."
                    disabled={isLoading}
                  />
                </Field>

                <Field className="sm:col-span-3">
                  <FieldLabel htmlFor="neighborhood">Bairro</FieldLabel>
                  <Input
                    id="neighborhood"
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    disabled={isLoading}
                  />
                </Field>

                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="city">Cidade</FieldLabel>
                  <Input
                    id="city"
                    type="text"
                    autoComplete="address-level2"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Recife"
                    disabled={isLoading}
                  />
                </Field>

                <Field className="sm:col-span-1">
                  <FieldLabel htmlFor="state">UF</FieldLabel>
                  <Input
                    id="state"
                    type="text"
                    maxLength={2}
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="PE"
                    disabled={isLoading}
                  />
                </Field>
              </div>
            </section>

            {/* Seção 3: Segurança */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground border-b pb-2">
                <Lock className="w-4 h-4 text-brand" /> Segurança
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <div className="relative flex items-center">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pr-10"
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

                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    disabled={isLoading}
                  />
                </Field>
              </div>
            </section>

            {activeError && (
              <FieldError role="alert" className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {activeError}
              </FieldError>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Finalizar cadastro
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Já possui uma conta?{" "}
            <Link href={loginHref} className="text-brand font-semibold hover:underline">
              Entrar agora
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <RegisterForm />
    </Suspense>
  );
}