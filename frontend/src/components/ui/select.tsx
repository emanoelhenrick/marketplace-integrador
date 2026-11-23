import * as React from "react";
import { cn } from "cn";

type SelectProps = React.ComponentProps<"select"> & { placeholder?: string };

function Select({ className, children, placeholder, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-8 w-full rounded-lg border border-input bg-card text-card-foreground px-2.5 py-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

export { Select };
