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
  Store,
  UserRound,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useSession } from "@/hooks/use-session";
import { getDashboardLabel, ROLE_LABEL } from "@/lib/permissions";
import { toast } from "@/lib/toast";
import { cn } from "cn";

interface UserMenuProps {
  iconClassName?: string;
}

const itemClass =
  "flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors text-left w-full";

export function UserMenu({ iconClassName = "w-7 h-7 text-brand-strong" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { user, role, isAuthenticated, isArtisan } = useSession();

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    close();
    router.push("/");
    toast.success("Você saiu da sua conta", { description: "Até a próxima!" });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Menu do usuário"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
      >
        {isAuthenticated && user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <CircleUserRound className={iconClassName} />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border bg-popover text-popover-foreground shadow-lg z-50 overflow-hidden"
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
                  <CircleUserRound className="w-10 h-10 text-brand-strong shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  {role && (
                    <p className="text-[11px] font-semibold text-brand mt-0.5">
                      {ROLE_LABEL[role]}
                    </p>
                  )}
                </div>
              </div>

              <nav className="flex flex-col py-1 text-sm">
                <Link href="/perfil" role="menuitem" onClick={close} className={itemClass}>
                  <UserRound className="w-4 h-4" /> Meu perfil
                </Link>
                <Link href="/dashboard" role="menuitem" onClick={close} className={itemClass}>
                  <LayoutDashboard className="w-4 h-4" /> {getDashboardLabel(role)}
                </Link>

                {isArtisan && (
                  <>
                    <Link
                      href={`/artesaos/${user.id}`}
                      role="menuitem"
                      onClick={close}
                      className={itemClass}
                    >
                      <Store className="w-4 h-4" /> Meu ateliê
                    </Link>
                    <Link
                      href="/produtos/novo"
                      role="menuitem"
                      onClick={close}
                      className={itemClass}
                    >
                      <PackagePlus className="w-4 h-4" /> Adicionar produto
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className={cn(itemClass, "text-brand-strong cursor-pointer border-t mt-1")}
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </nav>
            </>
          ) : (
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold">Você ainda não entrou</p>
                <p className="text-xs text-muted-foreground">
                  Entre para acompanhar pedidos ou, se for artesão, gerenciar seu ateliê.
                </p>
              </div>
              <Link
                href="/login"
                onClick={close}
                className="flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/85 transition-colors"
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
