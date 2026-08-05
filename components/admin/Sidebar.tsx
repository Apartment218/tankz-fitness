"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Dumbbell,
  CreditCard,
  ShoppingBag,
  Globe,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Members",
    href: "/admin/members",
    icon: Users,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    name: "Classes",
    href: "/admin/classes",
    icon: Dumbbell,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Website",
    href: "/admin/website",
    icon: Globe,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-zinc-900 text-white flex flex-col">
      <div className="border-b border-zinc-800 p-6">
        <h1 className="text-2xl font-bold">Tankz HQ</h1>
        <p className="text-sm text-zinc-400">
          Fitness Management System
        </p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                active
                  ? "bg-red-600 text-white"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4 text-xs text-zinc-500">
        Tankz HQ v1.0
      </div>
    </aside>
  );
}