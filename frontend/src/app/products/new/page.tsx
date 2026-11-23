"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { ProductForm } from "@/components/products/product-form";
import { useProductForm } from "@/hooks/use-product-form";
import { ACCESS, allowRoles } from "@/lib/permissions";

function NewProductForm() {
  const form = useProductForm();
  return (
    <ProductForm
      isEdit={false}
      values={form.values}
      errors={form.errors}
      formError={form.formError}
      isSaving={form.isSaving}
      defaultLocation={form.defaultLocation}
      onChange={form.setField}
      onSubmit={form.submit}
    />
  );
}

export default function NewProductPage() {
  return (
    <RoleGuard
      allow={allowRoles(ACCESS.artisan)}
      loginTitle="Você precisa entrar para cadastrar um produto"
      forbiddenTitle="Apenas artesãos podem cadastrar produtos"
      forbiddenDescription="Sua conta não é de artesão. Entre com uma conta de artesão para acessar esta página."
    >
      <NewProductForm />
    </RoleGuard>
  );
}
