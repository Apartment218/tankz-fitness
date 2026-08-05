import Link from "next/link";

import {
  Prisma,
  StaffRole,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import StaffList from "./StaffList";
import StaffPagination from "./StaffPagination";

type StaffPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
  }>;
};

const PAGE_SIZE = 10;

function parsePage(value: string | undefined) {
  const parsedPage = Number.parseInt(value ?? "1", 10);

  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

function isStaffRole(value: string): value is StaffRole {
  return Object.values(StaffRole).includes(
    value as StaffRole,
  );
}

export default async function StaffPage({
  searchParams,
}: StaffPageProps) {
  const params = await searchParams;

  const requestedPage = parsePage(params.page);
  const search = params.search?.trim() ?? "";

  const role =
    params.role && isStaffRole(params.role)
      ? params.role
      : "ALL";

  const status =
    params.status === "ACTIVE" ||
    params.status === "INACTIVE"
      ? params.status
      : "ALL";

  const where: Prisma.StaffWhereInput = {};

  if (search) {
    where.OR = [
      {
        firstName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (role !== "ALL") {
    where.role = role;
  }

  if (status === "ACTIVE") {
    where.active = true;
  }

  if (status === "INACTIVE") {
    where.active = false;
  }

  const [
    totalStaff,
    activeStaff,
    filteredStaffCount,
  ] = await prisma.$transaction([
    prisma.staff.count(),
    prisma.staff.count({
      where: {
        active: true,
      },
    }),
    prisma.staff.count({
      where,
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStaffCount / PAGE_SIZE),
  );

  const currentPage = Math.min(
    requestedPage,
    totalPages,
  );

  const staff = await prisma.staff.findMany({
    where,
    orderBy: [
      {
        active: "desc",
      },
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      _count: {
        select: {
          sessions: true,
        },
      },
    },
  });

  const inactiveStaff = totalStaff - activeStaff;

  const staffList = staff.map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    role: member.role,
    active: member.active,
    sessionCount: member._count.sessions,
  }));

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">
            Staff
          </h1>

          <p className="mt-2 text-lg text-zinc-600">
            Manage trainers, reception staff, managers and
            administrators.
          </p>
        </div>

        <Link
          href="/admin/staff/new"
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
        >
          + New Staff Member
        </Link>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Total Staff
          </p>

          <p className="mt-3 text-4xl font-black text-zinc-950">
            {totalStaff}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Active
          </p>

          <p className="mt-3 text-4xl font-black text-green-600">
            {activeStaff}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
            Inactive
          </p>

          <p className="mt-3 text-4xl font-black text-zinc-500">
            {inactiveStaff}
          </p>
        </div>
      </section>

      <StaffList
        staff={staffList}
        totalStaff={filteredStaffCount}
        availableRoles={Object.values(StaffRole)}
        currentSearch={search}
        currentRole={role}
        currentStatus={status}
      />

      <StaffPagination
        currentPage={currentPage}
        totalPages={
          filteredStaffCount === 0 ? 0 : totalPages
        }
        search={search}
        role={role}
        status={status}
      />
    </div>
  );
}