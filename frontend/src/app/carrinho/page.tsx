<<<<<<< HEAD
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useCartStore } from "@/store/cardStore";
import { useAuthStore } from "@/store/authStore";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    router.push(isAuthenticated ? "/checkout" : "/login");
  };

  return (
    <main className="px-4 sm:px-8 lg:px-20 py-6 sm:py-8">
      <div className="flex items-center gap-3 sm:gap-4 mb-6">
        <Button
          render={<Link href="/produtos" aria-label="Voltar para produtos" />}
          variant="outline"
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Seu Carrinho
        </h1>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-10 sm:py-12">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-4">
            <ShoppingBag className="text-muted-foreground/40 w-10 h-10 sm:w-12 sm:h-12" />
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold">
                Seu carrinho está vazio
              </h2>
              <p className="text-sm text-muted-foreground">
                Adicione alguns produtos para começar suas compras.
              </p>
            </div>
            <Button
              render={<Link href="/produtos" />}
              className="py-5 px-8 sm:px-15 w-full sm:w-auto"
            >
              Ver Produtos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1 text-center sm:text-left w-full sm:w-auto">
                    <h2 className="font-semibold text-base line-clamp-1">
                      {item.product.name}
                    </h2>
                    <p className="text-sm font-bold text-primary">
                      R$ {item.product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <span className="font-semibold text-sm text-right">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1 w-full">
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total de itens</span>
                  <span className="font-medium">{totalQuantity}</span>
                </div>
                <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    R$ {totalPrice().toFixed(2)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button
                  className="w-full cursor-pointer"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={clearCart}
                >
                  Limpar Carrinho
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
=======
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useCartStore } from "@/store/cardStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCartStore();

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="px-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon">
          <Link href="/produtos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Seu Carrinho</h1>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <ShoppingBag className="text-muted-foreground/40" />
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
              <p className="text-sm text-muted-foreground">
                Adicione alguns produtos para começar suas compras.
              </p>
            </div>
            <Button className="py-5 px-15">
              <Link href="/produtos">Ver Produtos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h2 className="font-semibold text-base line-clamp-1">
                      {item.product.name}
                    </h2>
                    <p className="text-sm font-bold text-primary">
                      R$ {item.product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <span className="font-semibold text-sm text-right">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total de itens</span>
                  <span className="font-medium">{totalQuantity}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    R$ {totalPrice().toFixed(2)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button className="w-full" size="lg">
                  Finalizar Compra
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={clearCart}
                >
                  Limpar Carrinho
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
>>>>>>> b183190bf7cb7c6c3dd7408c3d08cf427373cc17
