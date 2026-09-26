"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackagePlus, ShieldAlert } from "lucide-react";

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
import { useAuthStore } from "@/store/authStore";
import { productService } from "@/services/productService";

const CATEGORIES = [
  "Cerâmica & Barro",
  "Rendas & Bordados",
  "Xilogravura & Cordel",
];

export default function NewProductPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState(user?.role === "artisan" ? "" : "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <main className="px-4 sm:px-8 lg:px-20 py-16 sm:py-24 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-(--urucum) mx-auto" />
        <h1 className="text-xl sm:text-2xl font-bold text-carvao">
          Você precisa entrar para cadastrar um produto
        </h1>
        <Button
          render={<Link href="/login" />}
          className="mt-2 py-4 px-8 cursor-pointer"
        >
          Ir para o login
        </Button>
      </main>
    );
  }

  if (user.role !== "artisan") {
    return (
      <main className="px-4 sm:px-8 lg:px-20 py-16 sm:py-24 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-(--urucum) mx-auto" />
        <h1 className="text-xl sm:text-2xl font-bold text-carvao">
          Apenas artesãos podem cadastrar produtos
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Sua conta está identificada como cliente. Entre com uma conta de
          artesão para acessar esta página.
        </p>
        <Button
          render={<Link href="/produtos" />}
          variant="outline"
          className="mt-2 py-4 px-8 cursor-pointer"
        >
          Voltar para o acervo
        </Button>
      </main>
    );
  }

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
        artisanId: user.id,
      });
      router.push(`/produtos/${created.id}`);
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      setError("Não foi possível cadastrar o produto. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex justify-center px-4 sm:px-6 py-6 sm:py-10">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-carvao flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-(--urucum)" />
            Cadastrar novo produto
          </CardTitle>
          <CardDescription>
            Adicione uma peça ao seu acervo. Ela ficará disponível
            imediatamente em Produtos.
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
                  className="h-8 py-4 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
                placeholder={artisanLocationPlaceholder(user.name)}
                className="py-4"
              />
            </Field>

            {error && (
              <FieldError className="flex items-center gap-1.5">
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

function artisanLocationPlaceholder(name: string) {
  return `Ex.: Caruaru, PE (padrão: ${name})`;
}
