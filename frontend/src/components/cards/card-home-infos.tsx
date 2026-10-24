interface InfoCardProps {
  value: string;
  label: string;
}

export default function InfoCard(props: InfoCardProps) {
  return (
    <div className="w-full py-3 px-6 rounded-xl border bg-card/60">
      <p className="text-2xl font-bold text-brand">{props.value}</p>
      <p className="text-xs font-light text-muted-foreground">{props.label}</p>
    </div>
  );
}
