"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  name: "Contact enquiries",
  href: "/admin/leads",
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

const allNavigationItems = navigationGroups.flatMap(
  (group) => group.items,
);

function routeMatches(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  if (href === "/contact") {
    return pathname === "/contact";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveHref(pathname: string) {
  const matchingItems = allNavigationItems
    .filter((item) => routeMatches(pathname, item.href))
    .sort((first, second) => second.href.length - first.href.length);

  return matchingItems[0]?.href ?? null;
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

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminSidebarClient() {
  const pathname = usePathname();

  const activeHref = useMemo(
    () => getActiveHref(pathname),
    [pathname],
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      navigationGroups.map((group) => [
        group.name,
        group.items.some(
          (item) => item.href === getActiveHref(pathname),
        ),
      ]),
    ),
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setOpenGroups((current) => {
      const next = { ...current };

      navigationGroups.forEach((group) => {
        const containsActiveItem = group.items.some(
          (item) => item.href === activeHref,
        );

        if (containsActiveItem) {
          next[group.name] = true;
        }
      });

      return next;
    });
  }, [activeHref]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggleGroup(groupName: string) {
    setOpenGroups((current) => ({
      ...current,
      [groupName]: !current[groupName],
    }));
  }

  function renderNavigation(mobile = false) {
    const dashboardActive = pathname === "/admin";

    return (
      <>
        <Link
          href="/admin"
          className={`mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
            dashboardActive
              ? "bg-red-600 text-white"
              : mobile
                ? "text-zinc-700 hover:bg-zinc-100"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          <span className="text-base">📊</span>
          Dashboard
        </Link>

        <div className="space-y-2">
          {navigationGroups.map((group) => {
            const activeGroup = group.items.some(
              (item) => item.href === activeHref,
            );

            const open =
              openGroups[group.name] || activeGroup;

            return (
              <section
                key={group.name}
                className={`overflow-hidden rounded-2xl border ${
                  mobile
                    ? "border-zinc-200 bg-white"
                    : "border-zinc-800 bg-zinc-900/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleGroup(group.name)
                  }
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition ${
                    mobile
                      ? activeGroup
                        ? "bg-zinc-100 text-zinc-950"
                        : "text-zinc-700 hover:bg-zinc-100"
                      : activeGroup
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
                  <div
                    className={`border-t p-2 ${
                      mobile
                        ? "border-zinc-200"
                        : "border-zinc-800"
                    }`}
                  >
                    {group.items.map((item) => {
                      const active =
                        item.href === activeHref;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                            active
                              ? "bg-red-600 text-white"
                              : mobile
                                ? "text-zinc-700 hover:bg-zinc-100"
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
      </>
    );
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
          {renderNavigation()}
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

      <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex h-18 items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/admin"
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 font-black text-white">
              T
            </span>

            <span className="min-w-0">
              <span className="block truncate font-black text-zinc-950">
                Tankz HQ
              </span>

              <span className="block truncate text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                PT CRM + CMS
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-700"
            >
              Website
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin navigation"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,22rem)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-5">
              <Link
                href="/admin"
                className="flex items-center gap-3"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 font-black text-white">
                  T
                </span>

                <span>
                  <span className="block text-lg font-black text-zinc-950">
                    Tankz HQ
                  </span>

                  <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                    PT CRM + CMS
                  </span>
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close admin navigation"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5">
              {renderNavigation(true)}
            </nav>

            <div className="border-t border-zinc-200 p-4">
              <Link
                href="/"
                className="flex items-center justify-center rounded-xl border border-zinc-300 px-4 py-3 text-sm font-black text-zinc-700"
              >
                View public website
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}