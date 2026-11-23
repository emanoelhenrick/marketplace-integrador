import type { Artisan } from "@/types/artisan";

/** Biografia e dados culturais do artesão (conteúdo público). */
export function ArtisanPublicStory({ artisan }: { artisan: Artisan }) {
  const hasContent = artisan.bio || artisan.culturalHistory || artisan.techniques?.length || artisan.materials?.length;
  if (!hasContent) return null;

  return (
    <section aria-label="Biografia" className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-brand-soft border rounded-md p-5 sm:p-8">
      <div className="lg:col-span-2 space-y-4">
        {artisan.bio && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-brand uppercase tracking-wider">Biografia</p>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">{artisan.bio}</p>
          </div>
        )}
        {artisan.culturalHistory && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-brand uppercase tracking-wider">Tradição e memória</p>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-foreground/90">{artisan.culturalHistory}</p>
          </div>
        )}
      </div>

      <dl className="space-y-4 text-sm">
        {!!artisan.techniques?.length && (
          <div>
            <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Técnicas</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {artisan.techniques.map((t) => (
                <span key={t} className="text-xs border rounded-full px-2.5 py-0.5 bg-card">
                  {t}
                </span>
              ))}
            </dd>
          </div>
        )}
        {!!artisan.materials?.length && (
          <div>
            <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Materiais</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {artisan.materials.map((m) => (
                <span key={m} className="text-xs border rounded-full px-2.5 py-0.5 bg-card">
                  {m}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
