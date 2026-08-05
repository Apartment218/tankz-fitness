import type { ReactNode } from "react";

import { AdminSidebarClient } from "@/components/admin/admin-sidebar-client";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="flex min-h-screen">
        <AdminSidebarClient />

        <div className="min-w-0 flex-1">
          <main className="px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}