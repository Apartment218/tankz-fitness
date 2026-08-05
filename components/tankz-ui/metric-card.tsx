import type { ReactNode } from "react";

type MetricTone =
  | "red"
  | "green"
  | "blue"
  | "amber"
  | "purple"
  | "zinc";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  tone?: MetricTone;
};

function getToneClasses(tone: MetricTone) {
  switch (tone) {
    case "green":
      return {
        border: "border-l-emerald-500",
        icon: "bg-emerald-100 text-emerald-700",
        value: "text-emerald-700",
      };

    case "blue":
      return {
        border: "border-l-blue-500",
        icon: "bg-blue-100 text-blue-700",
        value: "text-blue-700",
      };

    case "amber":
      return {
        border: "border-l-amber-500",
        icon: "bg-amber-100 text-amber-700",
        value: "text-amber-700",
      };

    case "purple":
      return {
        border: "border-l-purple-500",
        icon: "bg-purple-100 text-purple-700",
        value: "text-purple-700",
      };

    case "zinc":
      return {
        border: "border-l-zinc-500",
        icon: "bg-zinc-100 text-zinc-700",
        value: "text-zinc-950",
      };

    case "red":
    default:
      return {
        border: "border-l-red-600",
        icon: "bg-red-100 text-red-700",
        value: "text-red-700",
      };
  }
}

export function MetricCard({
  label,
  value,
  description,
  icon,
  tone = "red",
}: MetricCardProps) {
  const toneClasses = getToneClasses(tone);

  return (
    <article
      className={`rounded-2xl border border-zinc-200 border-l-4 bg-white p-6 shadow-sm ${toneClasses.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
            {label}
          </p>

          <div
            className={`mt-3 truncate text-3xl font-black tracking-tight ${toneClasses.value}`}
          >
            {value}
          </div>

          {description ? (
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {description}
            </p>
          ) : null}
        </div>

        {icon ? (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClasses.icon}`}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </article>
  );
}