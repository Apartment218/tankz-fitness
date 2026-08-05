import Link from "next/link";

export const dynamic = "force-dynamic";

const reports = [
  {
    title: "Revenue",
    description:
      "Track income, payment performance, refunds, failed payments, and monthly revenue trends.",
    href: "/admin/reports/revenue",
    icon: "£",
    accent: "border-l-green-600",
    iconStyle: "bg-green-100 text-green-800",
  },
  {
    title: "Memberships",
    description:
      "Review active memberships, cancellations, expiring plans, and membership growth.",
    href: "/admin/reports/memberships",
    icon: "M",
    accent: "border-l-blue-600",
    iconStyle: "bg-blue-100 text-blue-800",
  },
  {
    title: "Attendance",
    description:
      "Analyse class attendance, no-shows, popular sessions, and member participation.",
    href: "/admin/reports/attendance",
    icon: "A",
    accent: "border-l-purple-600",
    iconStyle: "bg-purple-100 text-purple-800",
  },
  {
    title: "Shop",
    description:
      "Monitor product sales, order values, best sellers, and overall shop performance.",
    href: "/admin/reports/shop",
    icon: "S",
    accent: "border-l-orange-500",
    iconStyle: "bg-orange-100 text-orange-800",
  },
];

const plannedFeatures = [
  "Revenue by month",
  "Membership growth",
  "Attendance trends",
  "Best-selling products",
  "CSV exports",
  "Excel exports",
  "PDF reports",
];

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-7xl text-black">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">
          Tankz HQ
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Reports & Analytics
        </h1>

        <p className="mt-3 max-w-3xl text-lg font-medium text-gray-600">
          Review the performance of memberships, payments, attendance,
          and shop sales from one central reporting area.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className={`group rounded-2xl border border-gray-300 border-l-8 ${report.accent} bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex items-start justify-between gap-5">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black ${report.iconStyle}`}
              >
                {report.icon}
              </div>

              <span className="text-2xl font-black text-gray-300 transition group-hover:translate-x-1 group-hover:text-red-700">
                →
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-black">
              {report.title}
            </h2>

            <p className="mt-3 font-medium leading-7 text-gray-600">
              {report.description}
            </p>

            <p className="mt-6 font-bold text-red-700">
              Open {report.title.toLowerCase()} report
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">
              Reporting roadmap
            </h2>

            <p className="mt-2 max-w-3xl font-medium text-gray-600">
              These reporting tools will be added as the analytics
              section is completed.
            </p>
          </div>

          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-900">
            In progress
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plannedFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-700">
                ✓
              </span>

              <span className="font-semibold text-gray-800">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-gray-950 p-6 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">
          Analytics overview
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div>
            <p className="text-3xl font-black">4</p>
            <p className="mt-1 font-medium text-gray-300">
              Core report areas
            </p>
          </div>

          <div>
            <p className="text-3xl font-black">7</p>
            <p className="mt-1 font-medium text-gray-300">
              Planned reporting features
            </p>
          </div>

          <div>
            <p className="text-3xl font-black">3</p>
            <p className="mt-1 font-medium text-gray-300">
              Export formats planned
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}