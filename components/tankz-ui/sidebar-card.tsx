import type { ReactNode } from "react";

import { Card } from "./card";

type SidebarCardProps = {
  children: ReactNode;
};

export function SidebarCard({
  children,
}: SidebarCardProps) {
  return (
    <Card className="xl:col-span-1">
      {children}
    </Card>
  );
}