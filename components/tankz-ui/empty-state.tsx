import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center">
      {icon ? (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow">
          {icon}
        </div>
      ) : null}

      <h3 className="text-xl font-black text-zinc-900">
        {title}
      </h3>

      <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600">
        {description}
      </p>
    </div>
  );
}