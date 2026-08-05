import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      ) : null}
    </header>
  );
}