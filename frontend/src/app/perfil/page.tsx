/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  CircleUserRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  PackagePlus,
  Phone,
  Star,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";
import { Artisan } from "@/types/artisan";

export default function PerfilPage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const isArtisan = user?.role === "artisan";
  const artisan = isArtisan ? (user as unknown as Artisan) : null;

  useEffect(() => {
    if (!user || !isArtisan) return;

    let isMounted = true;

    async function loadMyProducts() {
      try {
        setIsLoadingProducts(true);
        const data = await productService.getByArtisan(user!.id);
        if (isMounted) setMyProducts(data);
      } catch (error) {
        console.error("Erro ao carregar seus produtos:", error);
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    }

    loadMyProducts();
    return () => {
      isMounted = false;
    };
  }, [user, isArtisan]);

  if (!isAuthenticated || !user) {
    return (
      <main className="px-4 sm:px-8 lg:px-20 py-16 sm:py-24 text-center space-y-4">
        <CircleUserRound className="w-12 h-12 text-(--urucum) mx-auto" />
        <h1 className="text-xl sm:text-2xl font-bold text-carvao">
          Você ainda não entrou na sua conta
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Entre com seu e-mail e senha para ver seu perfil e, se for
          artesão, cadastrar seus produtos.
        </p>
        <Button
          render={<Link href="/login" />}
          className="mt-2 py-4 px-8 cursor-pointer"
        >
          Ir para o login
        </Button>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-6 sm:py-8 space-y-8 sm:space-y-10">
      <Card className="overflow-hidden">
        <div className="bg-(--barro-claro) p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm shrink-0"
            />
          ) : (
            <CircleUserRound className="w-24 h-24 text-(--urucum) shrink-0" />
          )}

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold text-carvao">
                {user.name}
              </h1>
              <Badge variant={isArtisan ? "default" : "secondary"}>
                {isArtisan ? "Artesão(ã)" : "Cliente"}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-stone-600 justify-center sm:justify-start">
              <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail className="w-4 h-4 text-(--urucum) shrink-0" />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Phone className="w-4 h-4 text-(--urucum) shrink-0" />
                  {user.phone}
                </span>
              )}
            </div>

            {artisan && (
              <div className="pt-2 space-y-1.5">
                <p className="text-sm text-carvao font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                  <Award className="w-4 h-4 text-(--urucum) shrink-0" />
                  {artisan.craft} · {artisan.craftYears}
                </p>
                {artisan.location && (
                  <p className="text-sm text-stone-600 flex items-center gap-1.5 justify-center sm:justify-start">
                    <MapPin className="w-4 h-4 text-(--urucum) shrink-0" />
                    {artisan.location}
                  </p>
                )}
                {artisan.quote && (
                  <p className="text-sm text-stone-500 italic pt-1">
                    &ldquo;{artisan.quote}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              render={<Link href="/dashboard" />}
              variant="outline"
              className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" /> Ver painel
            </Button>

            {isArtisan ? (
              <Button
                render={<Link href="/produtos/novo" />}
                className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2"
              >
                <PackagePlus className="w-4 h-4" /> Adicionar novo produto
              </Button>
            ) : (
              <Button
                render={<Link href="/produtos" />}
                variant="outline"
                className="w-full sm:w-auto py-4 px-6 cursor-pointer"
              >
                Continuar comprando
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={logout}
            className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2 text-(--urucum)"
          >
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </CardFooter>
      </Card>

      {isArtisan && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-carvao">
              Meus produtos
            </h2>
            <Button
              render={<Link href="/produtos/novo" />}
              variant="outline"
              size="sm"
              className="cursor-pointer flex items-center gap-1.5"
            >
              <PackagePlus className="w-4 h-4" /> Novo produto
            </Button>
          </div>

          {isLoadingProducts ? (
            <div className="flex justify-center py-14">
              <Loader2 className="w-7 h-7 text-(--barro) animate-spin" />
            </div>
          ) : myProducts.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center space-y-3">
                <p className="text-sm text-stone-600">
                  Você ainda não cadastrou nenhum produto.
                </p>
                <Button
                  render={<Link href="/produtos/novo" />}
                  className="py-4 px-6 cursor-pointer"
                >
                  Cadastrar meu primeiro produto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {myProducts.map((product) => (
                <Link key={product.id} href={`/produtos/${product.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-1">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-(--barro)">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.price)}
                        </span>
                        <span className="flex items-center gap-1 text-stone-500">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {product.stars}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
