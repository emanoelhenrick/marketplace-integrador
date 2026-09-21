interface InfoCardProps {
  value: string;
  label: string;
}

export default function InfoCard(props: InfoCardProps) {
  return (
    <div className="w-full py-3 px-6 rounded-xl border">
      <p className="text-2xl font-bold text-(--barro)">{props.value}</p>
      <p className="text-xs font-thin text-(--carvao)">{props.label}</p>
    </div>
  );
}
