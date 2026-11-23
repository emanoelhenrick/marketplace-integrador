"use client";

interface StatusToggleProps {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label?: string;
}

export function StatusToggle({ checked, disabled = false, onChange, label }: StatusToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label || (checked ? "Desativar usuário" : "Ativar usuário")}
      disabled={disabled}
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
        focus-visible:ring-brand focus-visible:ring-offset-2
        ${checked ? "bg-emerald-600" : "bg-muted-foreground/30"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}