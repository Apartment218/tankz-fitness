import type { ReactNode } from "react";

type MainContentProps = {
  children: ReactNode;
};

export function MainContent({
  children,
}: MainContentProps) {
  return (
    <div className="space-y-6 xl:col-span-2">
      {children}
    </div>
  );
}