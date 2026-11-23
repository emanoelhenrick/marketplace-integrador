"use client";

import { useState } from "react";
import { parseApiError } from "@/lib/api-error";
import { toast } from "@/lib/toast";
import { validateArtisanProfile, type ArtisanProfileFormValues, type FieldErrors } from "@/lib/validation";
import { artisansService } from "@/services/artisansService";
import type { Artisan } from "@/types/artisan";

const toValues = (a: Artisan): ArtisanProfileFormValues => ({
  bio: a.bio ?? "",
  culturalHistory: a.culturalHistory ?? "",
  quote: a.quote ?? "",
  craft: a.craft ?? "",
  craftYears: a.craftYears ?? "",
  location: a.location ?? "",
  polo: a.polo ?? "",
  region: a.region ?? "",
  techniques: (a.techniques ?? []).join(", "),
  materials: (a.materials ?? []).join(", "),
});

/** Edição da própria biografia e dos dados culturais. A rota é /artisan/profile (sem id): só dá para editar o próprio perfil. */
export function useArtisanProfileForm(artisan: Artisan, onSaved: (artisan: Artisan) => void) {
  const [values, setValues] = useState<ArtisanProfileFormValues>(() => toValues(artisan));
  const [errors, setErrors] = useState<FieldErrors<ArtisanProfileFormValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const setField = (field: keyof ArtisanProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const submit = async () => {
    setFormError(null);
    const result = validateArtisanProfile(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setIsSaving(true);
    try {
      const saved = await artisansService.updateMyProfile(result.value);
      onSaved(saved);
      toast.success("Perfil atualizado", { description: "Sua biografia já aparece no perfil público." });
    } catch (err) {
      setFormError(parseApiError(err, "Não foi possível salvar o perfil.").message);
    } finally {
      setIsSaving(false);
    }
  };

  return { values, errors, setField, submit, formError, isSaving };
}
