"use client";

import { Loader2, Save } from "lucide-react";

import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useArtisanProfileForm } from "@/hooks/use-artisan-profile-form";
import { REGIONS } from "@/lib/constants";
import type { ArtisanProfileFormValues } from "@/lib/validation";
import type { Artisan } from "@/types/artisan";

export function ArtisanProfileForm({ artisan, onSaved }: { artisan: Artisan; onSaved: (a: Artisan) => void }) {
  const { values, errors, setField, submit, formError, isSaving } = useArtisanProfileForm(artisan, onSaved);

  const input = (field: keyof ArtisanProfileFormValues) => ({
    id: `p-${field}`,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField(field, e.target.value),
    disabled: isSaving,
    "aria-invalid": !!errors[field],
    className: "py-4",
  });
  const area = (field: keyof ArtisanProfileFormValues, rows: number) => ({
    id: `p-${field}`,
    rows,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setField(field, e.target.value),
    disabled: isSaving,
    "aria-invalid": !!errors[field],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu perfil público</CardTitle>
        <CardDescription>Biografia e dados culturais exibidos para os compradores.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="space-y-4"
        >
          <FormField id="p-bio" label="Biografia" error={errors.bio}>
            <Textarea {...area("bio", 5)} />
          </FormField>
          <FormField id="p-culturalHistory" label="Tradição e memória" error={errors.culturalHistory} hint="Origem do ofício, família, mestres que te ensinaram.">
            <Textarea {...area("culturalHistory", 5)} />
          </FormField>
          <FormField id="p-quote" label="Frase de assinatura" error={errors.quote}>
            <Input {...input("quote")} />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField id="p-craft" label="Ofício" error={errors.craft}>
              <Input {...input("craft")} />
            </FormField>
            <FormField id="p-craftYears" label="Tempo de ofício" error={errors.craftYears}>
              <Input {...input("craftYears")} placeholder="Ex.: 30 anos de ofício" />
            </FormField>
            <FormField id="p-location" label="Localidade" error={errors.location}>
              <Input {...input("location")} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField id="p-polo" label="Polo criativo" error={errors.polo}>
              <Input {...input("polo")} />
            </FormField>
            <FormField id="p-region" label="Região" error={errors.region}>
              <Select
                id="p-region"
                placeholder="Selecione"
                value={values.region}
                disabled={isSaving}
                onChange={(e) => setField("region", e.target.value)}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField id="p-techniques" label="Técnicas" error={errors.techniques} hint="Separe por vírgula.">
            <Input {...input("techniques")} />
          </FormField>
          <FormField id="p-materials" label="Materiais" error={errors.materials} hint="Separe por vírgula.">
            <Input {...input("materials")} />
          </FormField>

          {formError && (
            <p role="alert" className="text-sm text-destructive">
              {formError}
            </p>
          )}
          <Button type="submit" disabled={isSaving} className="cursor-pointer flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar perfil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
