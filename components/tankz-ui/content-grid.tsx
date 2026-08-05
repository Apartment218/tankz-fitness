import type { ReactNode } from "react";

type ContentGridProps = {
  children: ReactNode;
};

export function ContentGrid({
  children,
}: ContentGridProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {children}
    </div>
  );
}