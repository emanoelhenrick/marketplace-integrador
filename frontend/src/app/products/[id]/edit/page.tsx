"use client";

import { use } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { RoleGuard } from "@/components/auth/role-guard";
import { PageLoading, PageMessage } from "@/components/common/page-state";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { useProductForm } from "@/hooks/use-product-form";
import { ACCESS, allowRoles } from "@/lib/permissions";

function EditProductForm({ id }: { id: string }) {
  const form = useProductForm(id);

  if (form.isLoading) return <PageLoading />;

  if (form.notFound) {
    return (
      <PageMessage title="Produto não encontrado.">
        <Button render={<Link href="/dashboard" />} variant="outline" className="py-4 px-8">
          Voltar ao painel
        </Button>
      </PageMessage>
    );
  }

  // Artesão tentando editar peça de outro: nada é exibido nem enviado.
  if (form.notOwner) {
    return (
      <PageMessage icon={ShieldAlert} title="Você só pode editar os seus próprios produtos">
        <Button render={<Link href="/dashboard" />} variant="outline" className="py-4 px-8">
          Voltar ao painel
        </Button>
      </PageMessage>
    );
  }

  return (
    <ProductForm
      isEdit
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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RoleGuard
      allow={allowRoles(ACCESS.artisan)}
      loginTitle="Entre para editar sua peça"
      forbiddenTitle="Apenas artesãos podem editar produtos"
    >
      <EditProductForm id={id} />
    </RoleGuard>
  );
}
