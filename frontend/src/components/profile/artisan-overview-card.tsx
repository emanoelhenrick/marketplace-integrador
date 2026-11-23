"use client";

import { Award, Compass, Hammer, Layers, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Artisan } from "@/types/artisan";

export function ArtisanOverviewCard({ artisan }: { artisan: Artisan }) {
  const techniques = Array.isArray(artisan.techniques)
    ? artisan.techniques
    : typeof artisan.techniques === "string"
      ? artisan.techniques.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const materials = Array.isArray(artisan.materials)
    ? artisan.materials
    : typeof artisan.materials === "string"
      ? artisan.materials.split(",").map((m) => m.trim()).filter(Boolean)
      : [];

  return (
    <Card className="shadow-xs border-brand/20">
      <CardHeader className="pb-4 border-b bg-brand-soft/40">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-strong" />
          Resumo do Ateliê
        </CardTitle>
        <CardDescription>
          Dados culturais e regionais vinculados ao seu perfil de artesão(ã).
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="rounded-lg border bg-muted/25 p-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-strong" /> Ofício & Experiência
            </p>
            <p className="text-sm font-semibold mt-1">
              {artisan.craft || "Não informado"}
              {artisan.craftYears ? ` · ${artisan.craftYears}` : ""}
            </p>
          </div>

          <div className="rounded-lg border bg-muted/25 p-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-strong" /> Polo Criativo
            </p>
            <p className="text-sm font-semibold mt-1">
              {artisan.polo || "Não informado"}
            </p>
          </div>

          <div className="rounded-lg border bg-muted/25 p-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-strong" /> Região & Localidade
            </p>
            <p className="text-sm font-semibold mt-1">
              {[artisan.location, artisan.region].filter(Boolean).join(" · ") || "Não informado"}
            </p>
          </div>
        </div>

        {(techniques.length > 0 || materials.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {techniques.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-brand-strong" /> Técnicas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {techniques.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {materials.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-strong" /> Materiais
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {materials.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}