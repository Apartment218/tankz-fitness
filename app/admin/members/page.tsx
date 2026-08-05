import {
  MemberStatus,
  MembershipStatus,
  Prisma,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  PageContainer,
  PageHeader,
  Section,
  getStatusBadgeVariant,
} from "@/components/tankz-ui";

import DeleteMemberButton from "./DeleteMemberButton";
import Pagination from "./Pagination";

type ClientsPageProps = {
  searchParams: Promise<{
    search?: string;
    membership?: string;
    status?: string;
    page?: string;
  }>;
};

const CLIENTS_PER_PAGE = 10;

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMeasurement(value: Prisma.Decimal | null, unit: string) {
  if (value === null) {
    return "Not recorded";
  }

  return `${Number(value).toLocaleString("en-GB", {
    maximumFractionDigits: 1,
  })}${unit}`;
}

export default async function ClientsPage({
  searchParams,
}: ClientsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const membership = params.membership?.trim() ?? "";
  const status = params.status?.trim() ?? "";

  const requestedPage = Number(params.page ?? "1");
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const validStatuses = Object.values(MemberStatus);
  const selectedStatus = validStatuses.includes(status as MemberStatus)
    ? (status as MemberStatus)
    : undefined;

  const where: Prisma.MemberWhereInput = {
    ...(search
      ? {
          OR: [
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
            {
              goalDescription: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),

    ...(selectedStatus
      ? {
          status: selectedStatus,
        }
      : {}),

    ...(membership
      ? {
          memberships: {
            some: {
              status: {
                in: [
                  MembershipStatus.ACTIVE,
                  MembershipStatus.PAUSED,
                ],
              },
              plan: {
                name: membership,
              },
            },
          },
        }
      : {}),
  };

  const [totalClients, coachingPlans] = await Promise.all([
    prisma.member.count({
      where,
    }),

    prisma.membershipPlan.findMany({
      where: {
        active: true,
      },
      orderBy: {
        price: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalClients / CLIENTS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const clients = await prisma.member.findMany({
    where,
    orderBy: {
      joinedAt: "desc",
    },
    skip: (safeCurrentPage - 1) * CLIENTS_PER_PAGE,
    take: CLIENTS_PER_PAGE,
    include: {
      memberships: {
        where: {
          status: {
            in: [
              MembershipStatus.ACTIVE,
              MembershipStatus.PAUSED,
            ],
          },
        },
        include: {
          plan: true,
        },
        orderBy: {
          startDate: "desc",
        },
        take: 1,
      },
    },
  });

  const filtersAreActive = Boolean(
    search || membership || selectedStatus,
  );

  const firstResult =
    totalClients === 0
      ? 0
      : (safeCurrentPage - 1) * CLIENTS_PER_PAGE + 1;

  const lastResult = Math.min(
    safeCurrentPage * CLIENTS_PER_PAGE,
    totalClients,
  );

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Client Management"
        title="Clients"
        description="Manage personal-training clients, coaching goals, progress and account status."
        actions={
          <Button href="/admin/members/new" size="lg">
            Add client
          </Button>
        }
      />

      <Section
        title="Find clients"
        description="Search by contact details or coaching goal, then narrow the results by status or coaching plan."
      >
        <form
          method="GET"
          className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] lg:items-end"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Search
            </span>

            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Name, email, phone or goal..."
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Coaching plan
            </span>

            <select
              name="membership"
              defaultValue={membership}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            >
              <option value="">All plans</option>

              {coachingPlans.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Status
            </span>

            <select
              name="status"
              defaultValue={selectedStatus ?? ""}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>

          <Button type="submit" variant="secondary">
            Apply filters
          </Button>

          {filtersAreActive ? (
            <Button href="/admin/members" variant="outline">
              Clear
            </Button>
          ) : null}
        </form>
      </Section>

      <Section
        title="Client directory"
        description={
          totalClients === 0
            ? "No clients match the current filters."
            : `Showing ${firstResult}–${lastResult} of ${totalClients} clients.`
        }
        contentClassName="p-0"
      >
        {clients.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No clients found"
              description={
                filtersAreActive
                  ? "Try changing or clearing your search filters."
                  : "Add your first personal-training client to begin building their coaching profile."
              }
            />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-b border-zinc-200 bg-zinc-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                      Client
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                      Primary goal
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                      Progress
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                      Coaching
                    </th>

                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-200">
                  {clients.map((client) => {
                    const currentCoaching = client.memberships[0];

                    return (
                      <tr
                        key={client.id}
                        className="transition hover:bg-zinc-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <Avatar
                              firstName={client.firstName}
                              lastName={client.lastName}
                              size="sm"
                            />

                            <div className="min-w-0">
                              <a
                                href={`/admin/members/${client.id}`}
                                className="font-black text-zinc-950 transition hover:text-red-600"
                              >
                                {client.firstName} {client.lastName}
                              </a>

                              <p className="mt-1 truncate text-sm text-zinc-600">
                                {client.email}
                              </p>

                              <p className="mt-1 text-xs font-medium text-zinc-500">
                                Client since {formatDate(client.joinedAt)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold text-zinc-950">
                            {client.goal
                              ? formatStatus(client.goal)
                              : "Goal not set"}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-sm text-zinc-600">
                            {client.goalDescription ??
                              "Add a goal description from the client editor."}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold text-zinc-950">
                            {formatMeasurement(
                              client.currentWeightKg,
                              " kg",
                            )}
                          </p>

                          <p className="mt-1 text-sm text-zinc-600">
                            Target:{" "}
                            {formatMeasurement(
                              client.targetWeightKg,
                              " kg",
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold text-zinc-950">
                            {currentCoaching?.plan.name ??
                              "No active coaching plan"}
                          </p>

                          <p className="mt-1 text-sm text-zinc-600">
                            {currentCoaching
                              ? formatStatus(currentCoaching.status)
                              : "Unassigned"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <Badge
                            variant={getStatusBadgeVariant(
                              client.status,
                            )}
                          >
                            {formatStatus(client.status)}
                          </Badge>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-3">
                            <Button
                              href={`/admin/members/${client.id}`}
                              variant="outline"
                              size="sm"
                            >
                              View
                            </Button>

                            <Button
                              href={`/admin/members/${client.id}/edit`}
                              variant="ghost"
                              size="sm"
                            >
                              Edit
                            </Button>

                            <DeleteMemberButton
                              memberId={client.id}
                              memberName={`${client.firstName} ${client.lastName}`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-zinc-200 lg:hidden">
              {clients.map((client) => {
                const currentCoaching = client.memberships[0];

                return (
                  <article key={client.id} className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar
                        firstName={client.firstName}
                        lastName={client.lastName}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`/admin/members/${client.id}`}
                            className="text-lg font-black text-zinc-950"
                          >
                            {client.firstName} {client.lastName}
                          </a>

                          <Badge
                            variant={getStatusBadgeVariant(
                              client.status,
                            )}
                          >
                            {formatStatus(client.status)}
                          </Badge>
                        </div>

                        <p className="mt-1 break-all text-sm text-zinc-600">
                          {client.email}
                        </p>
                      </div>
                    </div>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                          Goal
                        </dt>

                        <dd className="mt-1 font-bold text-zinc-950">
                          {client.goal
                            ? formatStatus(client.goal)
                            : "Not set"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                          Current weight
                        </dt>

                        <dd className="mt-1 font-bold text-zinc-950">
                          {formatMeasurement(
                            client.currentWeightKg,
                            " kg",
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                          Coaching
                        </dt>

                        <dd className="mt-1 font-bold text-zinc-950">
                          {currentCoaching?.plan.name ?? "Not assigned"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                          Joined
                        </dt>

                        <dd className="mt-1 font-bold text-zinc-950">
                          {formatDate(client.joinedAt)}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button
                        href={`/admin/members/${client.id}`}
                        size="sm"
                      >
                        View client
                      </Button>

                      <Button
                        href={`/admin/members/${client.id}/edit`}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>

                      <DeleteMemberButton
                        memberId={client.id}
                        memberName={`${client.firstName} ${client.lastName}`}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </Section>

      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        search={search}
        membership={membership}
        status={selectedStatus}
      />
    </PageContainer>
  );
}