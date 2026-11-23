interface CatalogHeaderProps {
  isLoading: boolean;
  count: number;
  localities: number;
}

export function CatalogHeader({ isLoading, count, localities }: CatalogHeaderProps) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Acervo Geral de Obras e Criações Populares</h1>
      <p className="text-muted-foreground mt-2 font-bold text-sm sm:text-base" aria-live="polite">
        {isLoading
          ? "Carregando informações do acervo..."
          : `${count} ${count === 1 ? "peça disponível" : "peças disponíveis"}${
              localities > 0
                ? ` em ${localities} ${localities === 1 ? "localidade" : "localidades"} de Pernambuco.`
                : " em Pernambuco."
            }`}
      </p>
    </>
  );
}
