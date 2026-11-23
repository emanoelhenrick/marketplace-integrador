import { BookOpen } from "lucide-react";

/** A história da peça: narrativa completa escrita pelo artesão. */
export function ProductStory({ story }: { story?: string }) {
  if (!story?.trim()) return null;

  return (
    <section aria-labelledby="historia-da-peca" className="bg-card border rounded-md p-5 sm:p-8 space-y-3">
      <p className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5" aria-hidden /> História da peça
      </p>
      <h2 id="historia-da-peca" className="sr-only">
        História da peça
      </h2>
      {story
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph, i) => (
          <p key={i} className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
            {paragraph}
          </p>
        ))}
    </section>
  );
}
