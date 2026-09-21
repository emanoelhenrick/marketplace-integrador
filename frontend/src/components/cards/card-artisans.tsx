import { ArrowRight, CircleStar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function CardArtisan() {
  return (
    <Card className="bg-(--cru) w-120">
      <div className="flex items-center gap-5 px-5">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA62vnENRty6ZYmg7tQACYStm4SKLfkUr0oMC6AJdGZiNAKX2PF-TCfu4o_bp2c7ayC5Xq0YlnJ2-VvuM1kjcGr2fzj7zDxwSxS8P1SWlkDn-uyoqS5dZpHq8GaqzRLLNNkn9B5-x-pQbTv7rG-q7r2lXYoue73TH5PX5lxy744TAPuxJW8_9R1BWUUR37YGTDwCNxxyoEjhySw7SZYwez__p2vXQmkscpefLYHX5N4klnb8S7eCS46-g"
          className="w-25 h-25 rounded-full"
        />
        <div>
          <CardTitle className="font-bold text-(--carvao)">
            Mestra Rita Ferreira
          </CardTitle>
          <CardDescription> Cerâmica de Barro • MG </CardDescription>
          <div className="flex items-center gap-1.5 text-(--sol) font-bold text-sm">
            <CircleStar className="size-5 shrink-0" />
            <p>52 anos de ofício</p>
          </div>
        </div>
      </div>
      <CardContent>
        “Tiro da terra o sustento de três gerações. O barro conversa com quem
        tem paciência de escutar.”
      </CardContent>

      <CardFooter className="flex justify-between">
        <p>Campo Alegre, MG</p>
        <p className="flex items-center gap-1 text-(--carvao) font-bold">
          Ver 14 peças <ArrowRight></ArrowRight>
        </p>
      </CardFooter>
    </Card>
  );
}
