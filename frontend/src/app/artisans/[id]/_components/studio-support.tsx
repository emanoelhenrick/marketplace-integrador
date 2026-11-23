/* eslint-disable @next/next/no-img-element */
"use client";

import { HelpCircle, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

export function StudioSupport() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-card border rounded-lg p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
            alt="Clara Peixoto, curadora regional"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Sua curadora regional
            </span>
            <h4 className="font-bold text-base">Precisa de ajuda com fotos ou medidas?</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Clara Peixoto está à disposição para tirar dúvidas sobre cadastro de peças ou medidas de argila.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info("Contato por WhatsApp ainda não disponível")}
            className="cursor-pointer flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Falar no WhatsApp com Clara
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" /> Dica do mês para mestres
        </div>
        <h4 className="font-bold text-base">Como valorizar sua assinatura no barro</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Colecionadores valorizam ver o momento em que a peça é assinada à ponta de faca ou estilete.
          Ao cadastrar, tire uma foto em close-up do fundo da peça.
        </p>
      </div>
    </section>
  );
}
