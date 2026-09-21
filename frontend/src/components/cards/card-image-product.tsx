/* eslint-disable @next/next/no-img-element */
import { Heart, ShoppingCartPlus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/product";

export interface CardProductProps {
  product: Product;
}

export function CardImageProduct({ product }: CardProductProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return (
    <Card className="mx-auto w-full max-w-sm pt-0 bg-(--barro-claro) cursor-pointer hover:scale-105 transition-transform">
      <div className="relative aspect-video w-full overflow-hidden">
        <span className="absolute top-3 left-3 z-10 bg-white text-(--barro) text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {product.category}
        </span>
        <span className="absolute top-10 left-3 z-10 bg-white text-(--barro) text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {product.location}
        </span>

        <div className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full">
          <Heart></Heart>
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between h-7">
          <p className="text-(--mangue)">{product.artisan || "Acervo Manoa"}</p>
          <div className="flex justify-center items-center gap-1">
            <Star className="fill-(--sol) text-(--sol) size-4"></Star>
            <p className="text-(--sol) font-bold">{product.stars}</p>
          </div>
        </div>
        <CardTitle className="font-bold text-2xl h-17">{product.name}</CardTitle>

        <CardDescription className="h-15">{product.description}</CardDescription>

        <hr className="my-2"></hr>
        <div className="flex justify-between items-center">
          <div className="">
            <p>Preço</p>
            <p className="text-(--carvao) text-2xl font-bold">
              {formattedPrice}
            </p>
          </div>
          <Button className="py-2 px-8 cursor-pointer hover:scale-105 transition-transform ">
            <ShoppingCartPlus></ShoppingCartPlus> Comprar
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
