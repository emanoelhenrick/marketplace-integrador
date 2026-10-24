"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus, ShieldAlert } from "lucide-react";

import { RoleGuard } from "@/components/auth/role-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { productService } from "@/services/productService";
import { toast } from "@/lib/toast";

const CATEGORIES = ["Cerâmica & Barro", "Rendas & Bordados", "Xilogravura & Cordel"];

function NewProductForm() {
  const router = useRouter();
  const { user } = useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const numericPrice = Number(price.replace(",", "."));
    if (!name.trim() || !description.trim() || !image.trim()) {
      setError("Preencha nome, descrição e imagem do produto.");
      return;
    }
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Informe um preço válido, maior que zero.");
      return;
    }

    try {
      setIsSaving(true);
      const created = await productService.create({
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        image: image.trim(),
        category,
        location: location.trim() || user.name,
        stars: 5,
        artisanId: Number(user.id),
      });
      toast.success(`"${created.name}" cadastrado!`, {
        description: "A peça já está disponível no acervo.",
      });
      router.push(`/produtos/${created.id}`);
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      setError("Não foi possível cadastrar o produto. Tente novamente.");
      toast.error("Falha ao cadastrar o produto");
      setIsSaving(false);
    }
  };

  return (
    <main className="flex justify-center px-4 sm:px-6 py-2 sm:py-6">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-brand-strong" />
            Cadastrar novo produto
          </CardTitle>
          <CardDescription>
            Adicione uma peça ao seu acervo. Ela ficará disponível imediatamente em Produtos.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Nome da peça</FieldLabel>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Jarro Trançado em Palha"
                className="py-4"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <Input
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte a técnica e a história da peça"
                className="py-4"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="price">Preço (R$)</FieldLabel>
                <Input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="150.00"
                  className="py-4"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Categoria</FieldLabel>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-8 py-4 w-full rounded-lg border border-input bg-card text-card-foreground px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="image">URL da imagem</FieldLabel>
              <Input
                id="image"
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="py-4"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="location">Local de origem</FieldLabel>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={`Ex.: Caruaru, PE (padrão: ${user.name})`}
                className="py-4"
              />
            </Field>

            {error && (
              <FieldError role="alert" className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {error}
              </FieldError>
            )}

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              <PackagePlus className="w-4 h-4" />
              {isSaving ? "Salvando..." : "Cadastrar produto"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function NewProductPage() {
  return (
    <RoleGuard
      allow={["artisan"]}
      loginTitle="Você precisa entrar para cadastrar um produto"
      forbiddenTitle="Apenas artesãos podem cadastrar produtos"
      forbiddenDescription="Sua conta não é de artesão. Entre com uma conta de artesão para acessar esta página."
    >
      <NewProductForm />
    </RoleGuard>
  );
}
