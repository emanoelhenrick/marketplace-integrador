import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PAYMENT_METHODS } from "@/lib/constants";
import type { PaymentMethod } from "@/types/order";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

/** Pagamento simulado: escolhe a forma, mas nenhum dado de cartão é coletado. */
export function PaymentMethodSelector({ value, onChange, disabled }: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamento</CardTitle>
        <CardDescription>Ambiente de demonstração: nenhuma cobrança real é feita.</CardDescription>
      </CardHeader>
      <CardContent>
        <div role="radiogroup" aria-label="Forma de pagamento" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.value}
              className={`flex flex-col gap-1 rounded-md border p-3 text-sm cursor-pointer transition-colors ${
                value === method.value ? "border-brand bg-brand-soft" : "hover:bg-muted/60"
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="payment-method"
                  value={method.value}
                  checked={value === method.value}
                  disabled={disabled}
                  onChange={() => onChange(method.value)}
                />
                {method.label}
              </span>
              <span className="text-xs text-muted-foreground">{method.hint}</span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
