import { notFound } from "next/navigation";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  MetricCard,
  PageContainer,
  PageHeader,
  Section,
  StatGrid,
  getStatusBadgeVariant,
} from "@/components/tankz-ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ClientProfilePageProps = {
  params: Promise<{
    memberId: string;
  }>;
};

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCurrency(amount: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(
  value: { toString(): string } | number | null,
  unit: string,
) {
  if (value === null) {
    return "Not recorded";
  }

  return `${Number(value).toLocaleString("en-GB", {
    maximumFractionDigits: 1,
  })}${unit}`;
}

export default async function ClientProfilePage({
  params,
}: ClientProfilePageProps) {
  const { memberId } = await params;

  const now = new Date();

  const [
    client,
    paidPayments,
    attendedCount,
    upcomingCount,
    pendingPayments,
  ] = await Promise.all([
    prisma.member.findUnique({
      where: {
        id: memberId,
      },
      include: {
        memberships: {
          include: {
            plan: true,
          },
          orderBy: {
            startDate: "desc",
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        bookings: {
          include: {
            session: {
              include: {
                fitnessClass: true,
              },
            },
          },
          orderBy: {
            bookedAt: "desc",
          },
          take: 10,
        },
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    }),

    prisma.payment.aggregate({
      where: {
        memberId,
        status: "PAID",
        currency: "GBP",
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.booking.count({
      where: {
        memberId,
        status: "ATTENDED",
      },
    }),

    prisma.booking.count({
      where: {
        memberId,
        status: "CONFIRMED",
        session: {
          startsAt: {
            gte: now,
          },
          cancelled: false,
        },
      },
    }),

    prisma.payment.aggregate({
      where: {
        memberId,
        status: "PENDING",
        currency: "GBP",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  if (!client) {
    notFound();
  }

  const currentCoaching = client.memberships.find(
    (membership) =>
      membership.status === "ACTIVE" ||
      membership.status === "PAUSED",
  );

  const totalPaid = Number(paidPayments._sum.amount ?? 0);
  const outstandingBalance = Number(
    pendingPayments._sum.amount ?? 0,
  );

  const startingWeight =
    client.startingWeightKg === null
      ? null
      : Number(client.startingWeightKg);

  const currentWeight =
    client.currentWeightKg === null
      ? null
      : Number(client.currentWeightKg);

  const weightChange =
    startingWeight !== null && currentWeight !== null
      ? currentWeight - startingWeight
      : null;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Client Profile"
        title={`${client.firstName} ${client.lastName}`}
        description={`Client since ${formatLongDate(client.joinedAt)}. Review coaching goals, progress, sessions and account activity.`}
        actions={
          <>
            <Button href="/admin/members" variant="outline">
              Back to clients
            </Button>

            <Button href={`/admin/members/${client.id}/edit`}>
              Edit client
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden bg-zinc-950 text-white">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <Avatar
                firstName={client.firstName}
                lastName={client.lastName}
                size="lg"
              />

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-black tracking-tight">
                    {client.firstName} {client.lastName}
                  </h2>

                  <Badge
                    variant={getStatusBadgeVariant(client.status)}
                  >
                    {formatStatus(client.status)}
                  </Badge>
                </div>

                <p className="mt-2 text-zinc-300">
                  {client.goal
                    ? formatStatus(client.goal)
                    : "Primary goal not set"}
                </p>

                {client.goalDescription ? (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                    {client.goalDescription}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Current weight
                </p>

                <p className="mt-2 text-2xl font-black">
                  {formatNumber(client.currentWeightKg, " kg")}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Target weight
                </p>

                <p className="mt-2 text-2xl font-black">
                  {formatNumber(client.targetWeightKg, " kg")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatGrid>
        <MetricCard
          label="Total paid"
          value={formatCurrency(totalPaid)}
          description="Successful GBP payments"
          tone="green"
        />

        <MetricCard
          label="Sessions completed"
          value={attendedCount.toLocaleString("en-GB")}
          description="Recorded attended sessions"
          tone="blue"
        />

        <MetricCard
          label="Upcoming sessions"
          value={upcomingCount.toLocaleString("en-GB")}
          description="Confirmed future bookings"
          tone="purple"
        />

        <MetricCard
          label="Outstanding"
          value={formatCurrency(outstandingBalance)}
          description="Pending GBP payments"
          tone={outstandingBalance > 0 ? "amber" : "zinc"}
        />
      </StatGrid>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section
          title="Coaching overview"
          description="The client's current goal and key progress measurements."
          className="xl:col-span-2"
        >
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Primary goal
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {client.goal
                  ? formatStatus(client.goal)
                  : "Not set"}
              </dd>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Starting weight
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {formatNumber(client.startingWeightKg, " kg")}
              </dd>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Current weight
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {formatNumber(client.currentWeightKg, " kg")}
              </dd>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Target weight
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {formatNumber(client.targetWeightKg, " kg")}
              </dd>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Weight change
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {weightChange === null
                  ? "Not available"
                  : `${weightChange > 0 ? "+" : ""}${weightChange.toLocaleString(
                      "en-GB",
                      {
                        maximumFractionDigits: 1,
                      },
                    )} kg`}
              </dd>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Body fat
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {formatNumber(
                  client.bodyFatPercentage,
                  "%",
                )}
              </dd>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Height
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {formatNumber(client.heightCm, " cm")}
              </dd>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Consultation
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {client.consultationDate
                  ? formatDate(client.consultationDate)
                  : "Not recorded"}
              </dd>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <dt className="text-xs font-black uppercase tracking-wider text-zinc-500">
                Coaching plan
              </dt>

              <dd className="mt-2 text-lg font-black text-zinc-950">
                {currentCoaching?.plan.name ?? "Not assigned"}
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl border border-zinc-200 p-5">
            <h3 className="font-black text-zinc-950">
              Goal description
            </h3>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-zinc-600">
              {client.goalDescription ??
                "No detailed coaching goal has been recorded yet."}
            </p>
          </div>
        </Section>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>

              <CardDescription>
                Client contact and emergency information.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  Email
                </p>

                <a
                  href={`mailto:${client.email}`}
                  className="mt-1 block break-all font-bold text-red-600 hover:underline"
                >
                  {client.email}
                </a>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  Phone
                </p>

                {client.phone ? (
                  <a
                    href={`tel:${client.phone}`}
                    className="mt-1 block font-bold text-red-600 hover:underline"
                  >
                    {client.phone}
                  </a>
                ) : (
                  <p className="mt-1 font-medium text-zinc-500">
                    Not provided
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  Date of birth
                </p>

                <p className="mt-1 font-bold text-zinc-950">
                  {client.dateOfBirth
                    ? formatLongDate(client.dateOfBirth)
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                  Emergency contact
                </p>

                <p className="mt-1 font-bold text-zinc-950">
                  {client.emergencyName ?? "Not provided"}
                </p>

                {client.emergencyPhone ? (
                  <a
                    href={`tel:${client.emergencyPhone}`}
                    className="mt-1 block text-sm font-bold text-red-600 hover:underline"
                  >
                    {client.emergencyPhone}
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coach notes</CardTitle>

              <CardDescription>
                Private coaching context for this client.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                {client.coachNotes ??
                  "No private coach notes have been recorded yet."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Section
        title="Recent payments"
        description="The latest payment activity recorded for this client."
        actions={
          <Button href="/admin/payments" variant="outline" size="sm">
            View all payments
          </Button>
        }
        contentClassName="p-0"
      >
        {client.payments.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No payments recorded"
              description="Payments linked to this client will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Method
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200">
                {client.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-5 font-black text-zinc-950">
                      {formatCurrency(
                        Number(payment.amount),
                        payment.currency,
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <Badge
                        variant={getStatusBadgeVariant(
                          payment.status,
                        )}
                      >
                        {formatStatus(payment.status)}
                      </Badge>
                    </td>

                    <td className="px-6 py-5 font-medium text-zinc-700">
                      {payment.method
                        ? formatStatus(payment.method)
                        : "Not specified"}
                    </td>

                    <td className="px-6 py-5 font-medium text-zinc-700">
                      {payment.description ?? "—"}
                    </td>

                    <td className="px-6 py-5 font-medium text-zinc-700">
                      {formatDateTime(
                        payment.paidAt ?? payment.createdAt,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section
        title="Training sessions"
        description="The latest booked, completed and cancelled coaching sessions."
        actions={
          <Button href="/admin/attendance" variant="outline" size="sm">
            Manage sessions
          </Button>
        }
        contentClassName="p-0"
      >
        {client.bookings.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No sessions recorded"
              description="Booked coaching sessions will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Session
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Date and time
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Booked
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200">
                {client.bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-5 font-black text-zinc-950">
                      {booking.session.fitnessClass.name}
                    </td>

                    <td className="px-6 py-5 font-medium text-zinc-700">
                      {formatDateTime(booking.session.startsAt)}
                    </td>

                    <td className="px-6 py-5">
                      <Badge
                        variant={getStatusBadgeVariant(
                          booking.status,
                        )}
                      >
                        {formatStatus(booking.status)}
                      </Badge>
                    </td>

                    <td className="px-6 py-5 font-medium text-zinc-700">
                      {formatDate(booking.bookedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section
        title="Recent orders"
        description="The latest products or merchandise purchased by this client."
        actions={
          <Button href="/admin/orders" variant="outline" size="sm">
            View all orders
          </Button>
        }
        contentClassName="p-0"
      >
        {client.orders.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No orders recorded"
              description="Orders linked to this client will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {client.orders.map((order) => {
              const itemCount = order.items.reduce(
                (total, item) => total + item.quantity,
                0,
              );

              return (
                <div
                  key={order.id}
                  className="grid gap-5 p-6 transition hover:bg-zinc-50 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-black text-zinc-950">
                        Order #{order.id.slice(-8)}
                      </p>

                      <Badge
                        variant={getStatusBadgeVariant(order.status)}
                      >
                        {formatStatus(order.status)}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700"
                        >
                          {item.quantity} × {item.product.name}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm font-medium text-zinc-500">
                      Ordered {formatDateTime(order.createdAt)}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-2xl font-black text-zinc-950">
                      {formatCurrency(Number(order.total))}
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-600">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section
        title="Coaching history"
        description="Current and previous plans attached to this client's account."
        contentClassName="p-0"
      >
        {client.memberships.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No coaching history"
              description="Coaching plans assigned to this client will appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Plan
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Started
                  </th>

                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
                    Ended
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200">
                {client.memberships.map((membership) => (
                  <tr
                    key={membership.id}
                    className="hover:bg-zinc-50"
                  >
                    <td className="px-6 py-5 font-black text-zinc-950">
                      {membership.plan.name}
                    </td>

                    <td className="px-6 py-5">
                      <Badge
                        variant={getStatusBadgeVariant(
                          membership.status,
                        )}
                      >
                        {formatStatus(membership.status)}
                      </Badge>
                    </td>

                    <td className="px-6 py-5 font-medium text-zinc-700">
                      {formatDate(membership.startDate)}
                    </td>

                    <td className="px-6 py-5 font-medium text-zinc-700">
                      {formatDate(membership.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
