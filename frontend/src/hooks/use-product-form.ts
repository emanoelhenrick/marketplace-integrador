"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseApiError } from "@/lib/api-error";
import { canEditProduct } from "@/lib/permissions";
import { toast } from "@/lib/toast";
import { EMPTY_PRODUCT_FORM, validateProductForm, type FieldErrors } from "@/lib/validation";
import { productService } from "@/services/productService";
import { useAsync } from "@/hooks/use-async";
import { useSession } from "@/hooks/use-session";
import type { Id } from "@/types/common";
import type { Product, ProductFormValues } from "@/types/product";

const toFormValues = (p: Product): ProductFormValues => ({
  name: p.name,
  description: p.description,
  story: p.story ?? "",
  price: String(p.price).replace(".", ","),
  stock: String(p.stock),
  image: p.image,
  category: p.category,
  technique: p.technique ?? "",
  region: p.region ?? "",
  location: p.location ?? "",
});

/** Formulário compartilhado de cadastro e edição. Na edição, só o dono da peça consegue salvar. */
export function useProductForm(productId?: Id) {
  const router = useRouter();
  const { user } = useSession();
  const isEdit = productId !== undefined;

  const existing = useAsync(() => productService.getById(productId!), [productId], isEdit);
  const product = existing.data;

  // `draft` só existe depois da primeira edição; antes disso o formulário reflete o produto carregado.
  const [draft, setDraft] = useState<ProductFormValues | null>(null);
  const values = draft ?? (product ? toFormValues(product) : EMPTY_PRODUCT_FORM);
  const [errors, setErrors] = useState<FieldErrors<ProductFormValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const notOwner = isEdit && !!product && !canEditProduct(user, product);

  const setField = (field: keyof ProductFormValues, value: string) => {
    setDraft({ ...values, [field]: value });
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const submit = async () => {
    setFormError(null);
    if (notOwner) return;

    const result = validateProductForm({ ...values, location: values.location || user?.name || "" });
    if (!result.ok) {
      setErrors(result.errors);
      setFormError("Revise os campos destacados.");
      return;
    }
    setErrors({});

    setIsSaving(true);
    try {
      const saved = isEdit
        ? await productService.update(productId!, result.value)
        : await productService.create(result.value);
      toast.success(isEdit ? `"${saved.name}" atualizado` : `"${saved.name}" cadastrado!`, {
        description: isEdit ? "As alterações já estão no ar." : "A peça entra na vitrine assim que for aprovada e tiver estoque.",
      });
      router.push(`/products/${saved.id}`);
    } catch (err) {
      const info = parseApiError(err, "Não foi possível salvar o produto. Tente novamente.");
      if (info.fieldErrors) setErrors(info.fieldErrors as FieldErrors<ProductFormValues>);
      setFormError(info.status === 403 ? "Você só pode alterar os seus próprios produtos." : info.message);
      toast.error("Falha ao salvar o produto");
      setIsSaving(false);
    }
  };

  return {
    isEdit,
    values,
    errors,
    setField,
    submit,
    formError,
    isSaving,
    isLoading: isEdit && existing.loading,
    notFound: isEdit && !existing.loading && !product,
    notOwner,
    defaultLocation: user?.name ?? "",
  };
}
