/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  Award,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  PackagePlus,
  Phone,
  Store,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { getDashboardLabel, ROLE_LABEL } from "@/lib/permissions";
import type { Artisan } from "@/types/artisan";
import type { User } from "@/types/user";

interface ProfileHeaderProps {
  user: User;
  artisan: Artisan | null | undefined;
  onLogout: () => void;
}

export function ProfileHeader({ user, artisan, onLogout }: ProfileHeaderProps) {
  const role = user.role;

  return (
    <Card className="overflow-hidden py-0 gap-0 bg-card border-border/80 shadow-xs">
      <div className="bg-card px-6 py-7 sm:px-8 sm:py-8 flex flex-row items-center gap-4 sm:gap-6">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-border shadow-xs shrink-0"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-soft flex items-center justify-center shrink-0">
            <CircleUserRound className="w-12 h-12 sm:w-16 sm:h-16 text-brand-strong" />
          </div>
        )}

        <div className="flex-1 text-left space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2 justify-start">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
              {user.name}
            </h1>
            <Badge variant={role === "client" ? "secondary" : "default"}>
              {ROLE_LABEL[role]}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground justify-start">
            <span className="flex items-center gap-1.5 min-w-0">
              <Mail className="w-4 h-4 text-brand-strong shrink-0" />
              <span className="truncate">{user.email}</span>
            </span>

            {user.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-brand-strong shrink-0" />
                {user.phone}
              </span>
            )}
          </div>

          {artisan && (
            <div className="pt-1.5 space-y-1">
              <p className="text-sm font-semibold flex items-center gap-1.5 justify-start">
                <Award className="w-4 h-4 text-brand-strong shrink-0" />
                {artisan.craft}
                {artisan.craftYears ? ` · ${artisan.craftYears}` : ""}
              </p>

              {artisan.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-start">
                  <MapPin className="w-4 h-4 text-brand-strong shrink-0" />
                  {artisan.location}
                </p>
              )}

              {artisan.quote && (
                <p className="text-sm text-muted-foreground italic pt-0.5">
                  &ldquo;{artisan.quote}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Barra de ações inferior */}
      <CardFooter className="bg-card border-t px-6 py-4 sm:px-8 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            render={<Link href="/dashboard" />}
            variant="outline"
            className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" /> {getDashboardLabel(role)}
          </Button>

          {role === "artisan" && (
            <>
              <Button
                render={<Link href={`/artisans/${user.id}`} />}
                variant="outline"
                className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" /> Meu ateliê
              </Button>
              <Button
                render={<Link href="/products/new" />}
                className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2"
              >
                <PackagePlus className="w-4 h-4" /> Adicionar produto
              </Button>
            </>
          )}

          {role === "client" && (
            <Button
              render={<Link href="/products" />}
              className="w-full sm:w-auto py-4 px-6 cursor-pointer"
            >
              Continuar comprando
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onLogout}
          className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2 text-brand-strong"
        >
          <LogOut className="w-4 h-4" /> Sair
        </Button>
      </CardFooter>
    </Card>
  );
}