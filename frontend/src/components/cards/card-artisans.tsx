/* eslint-disable @next/next/no-img-element */
import { ArrowRight, CircleStar } from "lucide-react";
import Link from "next/link";
import { Artisan } from "@/types/artisan";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

interface CardArtisanProps {
  artisan: Artisan;
}

export default function CardArtisan({ artisan }: CardArtisanProps) {
  return (
    <Link href={`/artesaos/${artisan.id}`} className="block h-full group">
      <Card className="bg-card w-full h-full border border-border flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-pointer">
        <div>
          <div className="flex items-center gap-5 px-5 pt-5">
            <img
              src={artisan.avatarUrl}
              className="w-20 h-20 rounded-full object-cover shrink-0"
              alt={artisan.name}
            />
            <div>
              <CardTitle className="font-bold text-foreground text-lg group-hover:text-brand transition-colors">
                {artisan.name}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {artisan.craft} •{" "}
                {artisan.location.split(",")[1] || artisan.location}
              </CardDescription>
              <div className="flex items-center gap-1.5 text-gold font-bold text-xs mt-1">
                <CircleStar className="w-4 h-4 shrink-0" />
                <p>{artisan.craftYears}</p>
              </div>
            </div>
          </div>

          <CardContent className="mt-4 text-muted-foreground italic text-sm">
            &ldquo;{artisan.quote}&rdquo;
          </CardContent>
        </div>

        <CardFooter className="flex justify-between items-center border-t border-border pt-4 mt-2">
          <p className="text-xs text-muted-foreground">{artisan.location}</p>
          <div className="flex items-center gap-1 text-foreground font-bold text-xs group-hover:text-brand transition-colors">
            <span>Ver {artisan.totalWorks} peças</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
