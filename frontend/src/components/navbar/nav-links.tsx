"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

import { getNavLinks } from "@/lib/permissions";
import { useSession } from "@/hooks/use-session";

interface NavLinksProps {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
}

export function NavLinks({ orientation = "horizontal", onNavigate }: NavLinksProps) {
  const { role } = useSession();
  const pathname = usePathname();
  const links = getNavLinks(role);

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        "text-sm font-medium",
        orientation === "horizontal"
          ? "flex items-center gap-6"
          : "flex flex-col gap-1",
      )}
    >
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(`${link.href}/`) && link.href !== "/produtos");
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative transition-colors duration-200",
              orientation === "horizontal"
                ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-brand-strong after:transition-all after:duration-300 hover:text-brand-strong"
                : "rounded-md px-3 py-3 hover:bg-muted",
              orientation === "horizontal" &&
                (active ? "after:w-full text-brand-strong" : "after:w-0 hover:after:w-full text-foreground/80"),
              orientation === "vertical" &&
                (active ? "bg-muted text-brand-strong" : "text-foreground/80"),
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
