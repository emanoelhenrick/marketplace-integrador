"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/store/cardStore";
import { useSession } from "@/hooks/use-session";

interface CartButtonProps {
  variant?: "full" | "icon";
  onNavigate?: () => void;
}

/** Só aparece para visitantes e clientes: artesãos e administradores não compram. */
export function CartButton({ variant = "full", onNavigate }: CartButtonProps) {
  const totalItems = useCartStore((state) => state.totalItems());
  const { canPurchase } = useSession();

  if (!canPurchase) return null;

  if (variant === "icon") {
    return (
      <Link
        href="/carrinho"
        aria-label={`Carrinho${totalItems ? `, ${totalItems} item(ns)` : ""}`}
        onClick={onNavigate}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
      >
        <ShoppingBag className="w-6 h-6" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0 text-[10px] h-4 min-w-4 flex items-center justify-center">
            {totalItems}
          </Badge>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/carrinho"
      onClick={onNavigate}
      className={cn(
        buttonVariants(),
        "group flex items-center gap-2 bg-brand-soft text-foreground font-medium h-10 px-6 rounded-md cursor-pointer hover:bg-gold/30 hover:scale-105 active:scale-95 transition-all duration-200",
      )}
    >
      <ShoppingBag className="w-5 h-5" />
      <span>Carrinho</span>
      {totalItems > 0 && <Badge className="px-2 py-0.5">{totalItems}</Badge>}
    </Link>
  );
}
