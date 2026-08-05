import type { ReactNode } from "react";

type SectionProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

function mergeClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Section({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: SectionProps) {
  const hasHeader = title || description || actions;

  return (
    <section
      className={mergeClasses(
        "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm",
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            {title ? (
              <h2 className="text-xl font-black tracking-tight text-zinc-950">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={mergeClasses("p-6", contentClassName)}>
        {children}
      </div>
    </section>
  );
}