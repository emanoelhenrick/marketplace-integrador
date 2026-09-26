<<<<<<< HEAD
"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/navbar/user-menu";
import { useCartStore } from "@/store/cardStore";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "cn";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const stylesHoverLink =
    "relative text-carvao/80 hover:text-(--urucum) transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-(--urucum) hover:after:w-full after:transition-all after:duration-300";
  const totalItems = useCartStore((state) => state.totalItems());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-20 lg:py-5">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/">
            <img
              src="/assets/logo.png"
              alt="Manoa Logo"
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          <button
            type="button"
            aria-label={
              isDark ? "Ativar modo claro" : "Ativar modo escuro"
            }
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-carvao" />
            ) : (
              <Moon className="w-5 h-5 text-carvao" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/produtos" className={stylesHoverLink}>
              Produtos
            </Link>
            <Link href="/artesaos" className={stylesHoverLink}>
              Mestres e Histórias
            </Link>
            <Link href="/polos" className={stylesHoverLink}>
              Polos Criativos
            </Link>
            {isAuthenticated && user?.role === "artisan" && (
              <Link href="/produtos/novo" className={stylesHoverLink}>
                Adicionar Produto
              </Link>
            )}
          </nav>
          <Link
            href="/carrinho"
            className={cn(
              buttonVariants(),
              "group flex items-center gap-2 bg-(--barro-claro) text-carvao font-medium py-5 px-14 rounded-md cursor-pointer hover:bg-(--sol) hover:scale-105 active:scale-95 transition-all duration-200",
            )}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Carrinho</span>
            {totalItems > 0 && (
              <Badge className="px-2 py-0.5 transition-colors duration-200 group-hover:bg-white group-hover:text-(--sol)">
                {totalItems}
              </Badge>
            )}
          </Link>

          <UserMenu />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <Link
            href="/carrinho"
            aria-label="Carrinho"
            className="relative p-2 rounded-full hover:bg-(--barro-claro)/50 transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-carvao" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0 text-[10px] h-4 min-w-4 flex items-center justify-center">
                {totalItems}
              </Badge>
            )}
          </Link>

          <UserMenu iconClassName="w-6 h-6 sm:w-7 sm:h-7 text-(--urucum)" />

          <button
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-carvao" />
            ) : (
              <Menu className="w-6 h-6 text-carvao" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="lg:hidden flex flex-col gap-4 px-4 sm:px-6 pb-6 pt-2 text-sm font-medium border-t">
          <Link
            href="/produtos"
            className={stylesHoverLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Produtos
          </Link>
          <Link
            href="/artesaos"
            className={stylesHoverLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Mestres e Histórias
          </Link>
          <Link
            href="/polos"
            className={stylesHoverLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Polos Criativos
          </Link>
          {isAuthenticated && user?.role === "artisan" && (
            <Link
              href="/produtos/novo"
              className={stylesHoverLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Adicionar Produto
            </Link>
          )}

          <Link
            href="/carrinho"
            onClick={() => setIsMenuOpen(false)}
            className={cn(
              buttonVariants(),
              "group flex items-center justify-center gap-2 bg-(--barro-claro) text-carvao font-medium py-4 px-6 rounded-md cursor-pointer hover:bg-(--sol) active:scale-95 transition-all duration-200 w-full mt-2",
            )}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Carrinho</span>
            {totalItems > 0 && (
              <Badge className="px-2 py-0.5 transition-colors duration-200 group-hover:bg-white group-hover:text-(--sol)">
                {totalItems}
              </Badge>
            )}
          </Link>
        </nav>
      )}
    </header>
  );
}
=======
"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CircleUserRound, Moon, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cardStore";
import { cn } from "cn";

export default function NavBar() {
  const stylesHoverLink =
    "relative text-carvao/80 hover:text-(--urucum) transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-(--urucum) hover:after:w-full after:transition-all after:duration-300";
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <header className="py-5 px-20 border-b flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/">
          <img
            src="/assets/logo.png"
            alt="Manoa Logo"
            className="h-10 w-auto"
          />
        </Link>

        <button
          type="button"
          aria-label="Alternar tema"
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Moon className="w-5 h-5 text-carvao" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/produtos" className={stylesHoverLink}>
            Produtos
          </Link>
          <Link href="/mestres" className={stylesHoverLink}>
            Mestres e Histórias
          </Link>
          <Link href="/polos" className={stylesHoverLink}>
            Polos Criativos
          </Link>
        </nav>
        <Link
          href="/carrinho"
          className={cn(
            buttonVariants(),
            "group flex items-center gap-2 bg-(--barro-claro) text-carvao font-medium py-5 px-14 rounded-md cursor-pointer hover:bg-(--sol) hover:scale-105 active:scale-95 transition-all duration-200",
          )}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Carrinho</span>
          {totalItems > 0 && (
            <Badge className="px-2 py-0.5 transition-colors duration-200 group-hover:bg-white group-hover:text-(--sol)">
              {totalItems}
            </Badge>
          )}
        </Link>

        <Link
          href="/perfil"
          aria-label="Perfil do usuário"
          className="p-1 rounded-full hover:bg-(--barro-claro)/50 transition-colors"
        >
          <CircleUserRound className="w-7 h-7 text-(--urucum)" />
        </Link>
      </div>
    </header>
  );
}
>>>>>>> b183190bf7cb7c6c3dd7408c3d08cf427373cc17
