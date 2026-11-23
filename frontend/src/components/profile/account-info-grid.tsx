"use client";

import {
  Calendar,
  FileText,
  Mail,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROLE_LABEL } from "@/lib/permissions";
import type { User } from "@/types/user";

interface AddressFields {
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export type CompleteProfileUser = User & {
  cpf?: string;
  createdAt?: string | Date;
  address?: AddressFields;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

function formatCPF(cpf?: string) {
  if (!cpf) return null;
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatCEP(cep?: string) {
  if (!cep) return null;
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return cep;
  return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
}

function formatDate(date?: string | Date) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DataTile({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: typeof UserIcon;
  label: string;
  value?: string | null;
  className?: string;
}) {
  const hasValue = Boolean(value && value.trim() !== "");

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border bg-muted/25 p-3.5 transition-colors hover:bg-muted/40 ${className}`}
    >
      <div className="rounded-md bg-brand-soft p-2 text-brand-strong shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p
          className={`text-sm font-medium mt-0.5 break-words ${
            hasValue ? "text-foreground" : "text-muted-foreground italic font-normal"
          }`}
        >
          {hasValue ? value : "Não informado"}
        </p>
      </div>
    </div>
  );
}

export function AccountInfoGrid({ user }: { user: User }) {
  const fullUser = user as CompleteProfileUser;

  const address: AddressFields = {
    zipCode: fullUser.address?.zipCode ?? fullUser.zipCode,
    street: fullUser.address?.street ?? fullUser.street,
    number: fullUser.address?.number ?? fullUser.number,
    complement: fullUser.address?.complement ?? fullUser.complement,
    neighborhood: fullUser.address?.neighborhood ?? fullUser.neighborhood,
    city: fullUser.address?.city ?? fullUser.city,
    state: fullUser.address?.state ?? fullUser.state,
  };

  const streetWithNumber = [
    address.street,
    address.number ? `nº ${address.number}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const cityAndState = [address.city, address.state].filter(Boolean).join(" - ");

  return (
    <section aria-label="Informações cadastrais" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Dados Pessoais */}
      <Card className="shadow-xs">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-brand-strong" />
                Dados Pessoais
              </CardTitle>
              <CardDescription className="mt-1">
                Identificação e contato registrados na sua conta.
              </CardDescription>
            </div>
            {fullUser.role && (
              <Badge variant="outline" className="shrink-0">
                {ROLE_LABEL[fullUser.role]}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DataTile
            icon={UserIcon}
            label="Nome completo"
            value={fullUser.name}
            className="sm:col-span-2"
          />
          <DataTile
            icon={Mail}
            label="E-mail"
            value={fullUser.email}
            className="sm:col-span-2"
          />
          <DataTile
            icon={FileText}
            label="CPF"
            value={formatCPF(fullUser.cpf)}
          />
          <DataTile
            icon={Phone}
            label="Telefone / WhatsApp"
            value={fullUser.phone}
          />
          <DataTile
            icon={ShieldCheck}
            label="Status da conta"
            value={fullUser.active === false ? "Desativada" : "Ativa"}
          />
          <DataTile
            icon={Calendar}
            label="Cadastro em"
            value={formatDate(fullUser.createdAt)}
          />
        </CardContent>
      </Card>

      {/* Card 2: Endereço */}
      <Card className="shadow-xs">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-strong" />
                Endereço Cadastrado
              </CardTitle>
              <CardDescription className="mt-1">
                Localização informada para entregas e envio de pedidos.
              </CardDescription>
            </div>
            {address.state && (
              <Badge variant="secondary" className="shrink-0 font-semibold">
                {address.state.toUpperCase()}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DataTile
            icon={Navigation}
            label="CEP"
            value={formatCEP(address.zipCode)}
          />
          <DataTile
            icon={MapPin}
            label="Bairro"
            value={address.neighborhood}
          />
          <DataTile
            icon={MapPin}
            label="Rua / Avenida e Número"
            value={streetWithNumber}
            className="sm:col-span-2"
          />
          <DataTile
            icon={MapPin}
            label="Complemento"
            value={address.complement}
          />
          <DataTile
            icon={MapPin}
            label="Cidade / Estado"
            value={cityAndState}
          />
        </CardContent>
      </Card>
    </section>
  );
}