import { ArrowRight } from "lucide-react";

interface CardImageProps {
  numPieces: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export function CardImage(props: CardImageProps) {
  return (
    <div className="group relative mx-auto w-full bg-transparent rounded-2xl overflow-hidden cursor-pointer hover:bg-(--barro-claro)">
      <div className="relative h-72 w-full overflow-hidden">
        <span className="absolute top-3 right-3 z-10 bg-white text-(--barro) text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {props.numPieces} peças
        </span>
        <img
          src={props.imageUrl}
          alt={props.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1 p-7">
        <div className="flex justify-between">
          <p className="text-(--urucum)">{props.subtitle}</p>
        </div>
        <h3 className="font-semibold text-2xl transition-colors duration-200 group-hover:text-(--urucum)">
          {props.title}
        </h3>

        <p className="text-sm font-thin">{props.description}</p>
        <p className="flex items-center gap-1.5 text-(--urucum) font-light text-xs">
          Explorar Matriz{" "}
          <ArrowRight className="w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </p>
      </div>
    </div>
  );
}
