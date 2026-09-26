"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  UserRound,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { cn } from "cn";

interface UserMenuProps {
  iconClassName?: string;
}

export function UserMenu({
  iconClassName = "w-7 h-7 text-(--urucum)",
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Perfil do usuário"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-(--barro-claro)/50 transition-colors cursor-pointer"
      >
        <CircleUserRound className={iconClassName} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-md border bg-popover text-popover-foreground shadow-lg z-50 overflow-hidden"
        >
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <CircleUserRound className="w-10 h-10 text-(--urucum) shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="flex flex-col py-1 text-sm">
                <Link
                  href="/perfil"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors"
                >
                  <UserRound className="w-4 h-4" /> Meu perfil
                </Link>

                <Link
                  href="/dashboard"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Painel
                </Link>

                {user.role === "artisan" && (
                  <Link
                    href="/produtos/novo"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors"
                  >
                    <PackagePlus className="w-4 h-4" /> Adicionar produto
                  </Link>
                )}

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-left hover:bg-muted transition-colors cursor-pointer",
                    "text-(--urucum)",
                  )}
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </nav>
            </>
          ) : (
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold">
                  Você ainda não entrou
                </p>
                <p className="text-xs text-muted-foreground">
                  Entre para ver seu perfil e, se for artesão, cadastrar
                  produtos.
                </p>
              </div>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 py-2 rounded-md bg-(--barro) text-white text-sm font-semibold hover:bg-(--urucum) transition-colors"
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
