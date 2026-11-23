import type { ReactNode } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Rótulo + controle + mensagem de erro, com ids para acessibilidade. */
export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <FieldError id={`${id}-error`} role="alert">
          {error}
        </FieldError>
      )}
    </Field>
  );
}
