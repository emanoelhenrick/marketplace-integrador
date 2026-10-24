import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}

export function KpiCard({ icon, label, value, hint }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-brand-soft flex items-center justify-center shrink-0 text-brand">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-lg sm:text-2xl font-bold truncate">{value}</p>
          {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
