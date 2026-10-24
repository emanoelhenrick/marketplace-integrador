"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { CartButton } from "@/components/navbar/cart-button";
import { NavLinks } from "@/components/navbar/nav-links";
import { ThemeToggle } from "@/components/navbar/theme-toggle";
import { UserMenu } from "@/components/navbar/user-menu";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="flex items-center justify-between gap-4 py-3 px-4 sm:px-6 lg:px-20">
        <Link href="/" aria-label="Manoa — página inicial" onClick={closeMenu}>
          <img src="/assets/logo.png" alt="Manoa" className="h-8 sm:h-10 w-auto rounded-md dark:bg-cru dark:px-2" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <NavLinks />
          <CartButton />
          <ThemeToggle />
          <UserMenu />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
          <CartButton variant="icon" onNavigate={closeMenu} />
          <ThemeToggle />
          <UserMenu iconClassName="w-6 h-6 sm:w-7 sm:h-7 text-brand-strong" />
          <button
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t px-4 sm:px-6 pb-4 pt-2 max-h-[70vh] overflow-y-auto">
          <NavLinks orientation="vertical" onNavigate={closeMenu} />
        </div>
      )}
    </header>
  );
}
