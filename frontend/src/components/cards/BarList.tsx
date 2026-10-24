interface BarListItem {
  label: string;
  value: number;
  displayValue: string;
}

interface BarListProps {
  data: BarListItem[];
  emptyLabel?: string;
}

export function BarList({
  data,
  emptyLabel = "Sem dados suficientes ainda.",
}: BarListProps) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between gap-3 text-xs sm:text-sm mb-1">
            <span className="font-medium truncate">{d.label}</span>
            <span className="text-muted-foreground shrink-0">{d.displayValue}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${Math.max((d.value / max) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
