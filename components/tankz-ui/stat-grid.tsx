import type { ReactNode } from "react";

type StatGridProps = {
  children: ReactNode;
};

export function StatGrid({
  children,
}: StatGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
}