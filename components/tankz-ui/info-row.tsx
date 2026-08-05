import type { ReactNode } from "react";

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

export function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 py-3">
      <span className="text-sm font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </span>

      <span className="font-semibold text-zinc-900">
        {value}
      </span>
    </div>
  );
}