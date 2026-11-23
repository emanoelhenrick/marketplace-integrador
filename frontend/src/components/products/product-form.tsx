"use client";

import { Loader2, PackagePlus, Save, ShieldAlert } from "lucide-react";

import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, REGIONS, TECHNIQUES } from "@/lib/constants";
import type { FieldErrors } from "@/lib/validation";
import type { ProductFormValues } from "@/types/product";

interface ProductFormProps {
  isEdit: boolean;
  values: ProductFormValues;
  errors: FieldErrors<ProductFormValues>;
  formError: string | null;
  isSaving: boolean;
  defaultLocation: string;
  onChange: (field: keyof ProductFormValues, value: string) => void;
  onSubmit: () => void;
}

/** Formulário de cadastro/edição de peça (validação no hook, exibição aqui). */
export function ProductForm({ isEdit, values, errors, formError, isSaving, defaultLocation, onChange, onSubmit }: ProductFormProps) {
  const text = (field: keyof ProductFormValues) => ({
    id: field,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value),
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
    className: "py-4",
    disabled: isSaving,
  });

  const select = (field: keyof ProductFormValues) => ({
    id: field,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(field, e.target.value),
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
    disabled: isSaving,
  });

  return (
    <main className="flex justify-center px-4 sm:px-6 py-2 sm:py-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-brand-strong" />
            {isEdit ? "Editar produto" : "Cadastrar novo produto"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Atualize os dados da sua peça. Para tirar da vitrine, use “Desativar” no seu ateliê."
              : "Adicione uma peça ao seu acervo. Ela aparece na vitrine quando estiver aprovada e com estoque."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-4"
          >
            <FormField id="name" label="Nome da peça" error={errors.name}>
              <Input {...text("name")} placeholder="Ex.: Jarro Trançado em Palha" />
            </FormField>

            <FormField id="description" label="Descrição curta" error={errors.description} hint="Aparece nos cards da vitrine.">
              <Input {...text("description")} placeholder="Uma frase sobre a peça" />
            </FormField>

            <FormField id="story" label="História da peça" error={errors.story} hint="Técnica, inspiração e memória por trás da peça.">
              <Textarea
                id="story"
                value={values.story}
                onChange={(e) => onChange("story", e.target.value)}
                aria-invalid={!!errors.story}
                aria-describedby={errors.story ? "story-error" : undefined}
                disabled={isSaving}
                rows={5}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField id="price" label="Preço (R$)" error={errors.price}>
                <Input {...text("price")} type="text" inputMode="decimal" placeholder="150,00" />
              </FormField>
              <FormField id="stock" label="Estoque (unidades)" error={errors.stock}>
                <Input {...text("stock")} type="number" step="1" min="1" />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField id="category" label="Categoria" error={errors.category}>
                <Select {...select("category")} placeholder="Selecione">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="technique" label="Técnica" error={errors.technique}>
                <Select {...select("technique")} placeholder="Selecione">
                  {TECHNIQUES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="region" label="Região" error={errors.region}>
                <Select {...select("region")} placeholder="Selecione">
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField id="image" label="URL da imagem" error={errors.image}>
              <Input {...text("image")} type="url" placeholder="https://..." />
            </FormField>

            <FormField id="location" label="Local de origem" error={errors.location}>
              <Input {...text("location")} placeholder={`Ex.: Caruaru, PE (padrão: ${defaultLocation})`} />
            </FormField>

            {formError && (
              <FieldError role="alert" className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {formError}
              </FieldError>
            )}

            <Button type="submit" disabled={isSaving} className="w-full py-4 font-semibold cursor-pointer flex items-center justify-center gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? <Save className="w-4 h-4" /> : <PackagePlus className="w-4 h-4" />}
              {isSaving ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar produto"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
