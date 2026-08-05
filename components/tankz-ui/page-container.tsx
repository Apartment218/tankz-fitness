import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {children}
    </div>
  );
}