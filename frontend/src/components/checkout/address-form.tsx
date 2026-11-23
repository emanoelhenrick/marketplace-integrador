"use client";

import { FormField } from "@/components/common/form-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BR_STATES } from "@/lib/constants";
import type { FieldErrors } from "@/lib/validation";
import type { ShippingAddress } from "@/types/order";

interface AddressFormProps {
  address: ShippingAddress;
  errors: FieldErrors<ShippingAddress>;
  disabled?: boolean;
  onChange: (field: keyof ShippingAddress, value: string) => void;
}

export function AddressForm({ address, errors, disabled, onChange }: AddressFormProps) {
  const bind = (field: keyof ShippingAddress, autoComplete?: string) => ({
    id: `addr-${field}`,
    value: address[field] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value),
    disabled,
    autoComplete,
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `addr-${field}-error` : undefined,
    className: "py-4",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço de entrega</CardTitle>
        <CardDescription>Para onde enviaremos a sua peça.</CardDescription>
      </CardHeader>
      <CardContent>
        <fieldset disabled={disabled} className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div className="sm:col-span-4">
            <FormField id="addr-recipientName" label="Nome de quem recebe" error={errors.recipientName}>
              <Input {...bind("recipientName", "name")} />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField id="addr-phone" label="Telefone" error={errors.phone}>
              <Input {...bind("phone", "tel")} inputMode="tel" placeholder="(81) 99999-9999" />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField id="addr-zipCode" label="CEP" error={errors.zipCode}>
              <Input {...bind("zipCode", "postal-code")} inputMode="numeric" placeholder="00000-000" />
            </FormField>
          </div>
          <div className="sm:col-span-4">
            <FormField id="addr-street" label="Rua / Avenida" error={errors.street}>
              <Input {...bind("street", "address-line1")} />
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField id="addr-number" label="Número" error={errors.number}>
              <Input {...bind("number")} placeholder="123 ou S/N" />
            </FormField>
          </div>
          <div className="sm:col-span-4">
            <FormField id="addr-complement" label="Complemento (opcional)" error={errors.complement}>
              <Input {...bind("complement", "address-line2")} placeholder="Apto, bloco, referência" />
            </FormField>
          </div>

          <div className="sm:col-span-3">
            <FormField id="addr-neighborhood" label="Bairro" error={errors.neighborhood}>
              <Input {...bind("neighborhood")} />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField id="addr-city" label="Cidade" error={errors.city}>
              <Input {...bind("city", "address-level2")} />
            </FormField>
          </div>
          <div className="sm:col-span-1">
            <FormField id="addr-state" label="UF" error={errors.state}>
              <select
                id="addr-state"
                value={address.state ?? ""}
                onChange={(e) => onChange("state", e.target.value)}
                disabled={disabled}
                autoComplete="address-level1"
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? "addr-state-error" : undefined}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
              >
                <option value="" disabled className="bg-background text-muted-foreground">
                  UF
                </option>
                {BR_STATES.map((uf) => (
                  <option key={uf} value={uf} className="bg-background text-foreground">
                    {uf}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
}