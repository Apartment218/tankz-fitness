"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavigationItem = {
  name: string;
  href: string;
};

type NavigationGroup = {
  name: string;
  icon: string;
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    name: "CRM",
    icon: "👥",
    items: [
      {
        name: "Clients",
        href: "/admin/members",
      },
      {
        name: "Leads",
        href: "/admin/leads",
      },
      {
        name: "Memberships",
        href: "/admin/memberships",
      },
      {
        name: "Sessions",
        href: "/admin/attendance",
      },
      {
        name: "Classes",
        href: "/admin/classes",
      },
    ],
  },
  {
    name: "Website",
    icon: "🌐",
    items: [
      {
        name: "Website overview",
        href: "/admin/website",
      },
      {
        name: "Homepage",
        href: "/admin/website/homepage",
      },
      {
        name: "Premium hero",
        href: "/admin/website/homepage/hero",
      },
      {
        name: "Pages",
        href: "/admin/website/pages",
      },
      {
        name: "Services",
        href: "/admin/services",
      },
      {
        name: "Public team",
        href: "/admin/website/team",
      },
      {
        name: "Testimonials",
        href: "/admin/website/testimonials",
      },
      {
        name: "Transformations",
        href: "/admin/website/transformations",
      },
      {
        name: "Gallery",
        href: "/admin/website/gallery",
      },
      {
        name: "FAQ",
        href: "/admin/website/faq",
      },
      {
        name: "Contact page",
        href: "/contact",
      },
      {
        name: "Website settings",
        href: "/admin/website/settings",
      },
    ],
  },
  {
    name: "Commerce",
    icon: "💳",
    items: [
      {
        name: "Subscriptions",
        href: "/admin/subscriptions",
      },
      {
        name: "Payments",
        href: "/admin/payments",
      },
      {
        name: "Products",
        href: "/admin/products",
      },
      {
        name: "Orders",
        href: "/admin/orders",
      },
    ],
  },
  {
    name: "Analytics",
    icon: "📈",
    items: [
      {
        name: "Reports",
        href: "/admin/reports",
      },
    ],
  },
  {
    name: "System",
    icon: "⚙️",
    items: [
      {
        name: "Staff team",
        href: "/admin/staff",
      },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  if (href === "/contact") {
    return pathname === "/contact";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupContainsActivePath(
  pathname: string,
  group: NavigationGroup,
) {
  return group.items.some((item) =>
    isActivePath(pathname, item.href),
  );
}

function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 transition-transform ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="m5 7.5 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminSidebarClient() {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      navigationGroups.map((group) => [
        group.name,
        groupContainsActivePath(pathname, group),
      ]),
    ),
  );

  function toggleGroup(groupName: string) {
    setOpenGroups((current) => ({
      ...current,
      [groupName]: !current[groupName],
    }));
  }

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 text-white lg:flex lg:flex-col">
        <div className="border-b border-zinc-800 px-6 py-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-black text-white">
              T
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight">
                Tankz HQ
              </span>

              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                PT CRM + CMS
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <Link
            href="/admin"
            className={`mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
              isActivePath(pathname, "/admin")
                ? "bg-red-600 text-white"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <span className="text-base">📊</span>
            Dashboard
          </Link>

          <div className="space-y-2">
            {navigationGroups.map((group) => {
              const activeGroup = groupContainsActivePath(
                pathname,
                group,
              );
              const open =
                openGroups[group.name] || activeGroup;

              return (
                <section
                  key={group.name}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40"
                >
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.name)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition ${
                      activeGroup
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-base">
                        {group.icon}
                      </span>

                      <span className="text-xs font-black uppercase tracking-[0.18em]">
                        {group.name}
                      </span>
                    </span>

                    <ChevronIcon open={open} />
                  </button>

                  {open ? (
                    <div className="border-t border-zinc-800 p-2">
                      {group.items.map((item) => {
                        const active = isActivePath(
                          pathname,
                          item.href,
                        );

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                              active
                                ? "bg-red-600 text-white"
                                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            }`}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
          >
            View public website
          </Link>
        </div>
      </aside>

      <header className="border-b border-zinc-200 bg-white lg:hidden">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-black text-white">
                T
              </span>

              <span>
                <span className="block font-black text-zinc-950">
                  Tankz HQ
                </span>

                <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  PT CRM + CMS
                </span>
              </span>
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-700"
            >
              Website
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            <Link
              href="/admin"
              className={`flex items-center rounded-xl px-4 py-3 text-sm font-black ${
                isActivePath(pathname, "/admin")
                  ? "bg-red-600 text-white"
                  : "bg-zinc-100 text-zinc-800"
              }`}
            >
              Dashboard
            </Link>

            {navigationGroups.map((group) => {
              const activeGroup = groupContainsActivePath(
                pathname,
                group,
              );
              const open =
                openGroups[group.name] || activeGroup;

              return (
                <div
                  key={group.name}
                  className="overflow-hidden rounded-xl border border-zinc-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.name)}
                    className="flex w-full items-center justify-between bg-zinc-100 px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-2 text-sm font-black text-zinc-900">
                      <span>{group.icon}</span>
                      {group.name}
                    </span>

                    <ChevronIcon open={open} />
                  </button>

                  {open ? (
                    <div className="grid gap-1 border-t border-zinc-200 bg-white p-2 sm:grid-cols-2">
                      {group.items.map((item) => {
                        const active = isActivePath(
                          pathname,
                          item.href,
                        );

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
                              active
                                ? "bg-red-600 text-white"
                                : "text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}