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
  artisan: Artisan | null;
  onLogout: () => void;
}

export function ProfileHeader({ user, artisan, onLogout }: ProfileHeaderProps) {
  const role = user.role;

  return (
    <Card className="overflow-hidden">
      <div className="bg-brand-soft p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-sm shrink-0"
          />
        ) : (
          <CircleUserRound className="w-24 h-24 text-brand-strong shrink-0" />
        )}

        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
            <Badge variant={role === "client" ? "secondary" : "default"} className="self-center sm:self-auto">
              {ROLE_LABEL[role]}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-muted-foreground justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 justify-center sm:justify-start min-w-0">
              <Mail className="w-4 h-4 text-brand-strong shrink-0" />
              <span className="truncate">{user.email}</span>
            </span>
            {user.phone && (
              <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                <Phone className="w-4 h-4 text-brand-strong shrink-0" />
                {user.phone}
              </span>
            )}
          </div>

          {artisan && (
            <div className="pt-2 space-y-1.5">
              <p className="text-sm font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <Award className="w-4 h-4 text-brand-strong shrink-0" />
                {artisan.craft} · {artisan.craftYears}
              </p>
              {artisan.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                  <MapPin className="w-4 h-4 text-brand-strong shrink-0" />
                  {artisan.location}
                </p>
              )}
              {artisan.quote && (
                <p className="text-sm text-muted-foreground italic pt-1">&ldquo;{artisan.quote}&rdquo;</p>
              )}
            </div>
          )}
        </div>
      </div>

      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
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
                render={<Link href={`/artesaos/${user.id}`} />}
                variant="outline"
                className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" /> Meu ateliê
              </Button>
              <Button
                render={<Link href="/produtos/novo" />}
                className="w-full sm:w-auto py-4 px-6 cursor-pointer flex items-center justify-center gap-2"
              >
                <PackagePlus className="w-4 h-4" /> Adicionar produto
              </Button>
            </>
          )}

          {role === "client" && (
            <Button
              render={<Link href="/produtos" />}
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
