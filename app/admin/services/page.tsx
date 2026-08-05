import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  PageContainer,
  PageHeader,
  Section,
} from "@/components/tankz-ui";
import { prisma } from "@/lib/prisma";

import {
  createService,
  deleteService,
  toggleService,
  updateService,
} from "./actions";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const inputClasses =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textareaClasses =
  "min-h-28 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

function formatDuration(days: number) {
  if (days === 1) {
    return "1 day";
  }

  if (days === 7) {
    return "1 week";
  }

  if (days === 14) {
    return "2 weeks";
  }

  if ([28, 30, 31].includes(days)) {
    return "1 month";
  }

  if ([90, 91].includes(days)) {
    return "3 months";
  }

  if ([180, 182].includes(days)) {
    return "6 months";
  }

  if ([365, 366].includes(days)) {
    return "1 year";
  }

  return `${days} days`;
}

export default async function ServicesPage() {
  const services = await prisma.membershipPlan.findMany({
    orderBy: [
      {
        active: "desc",
      },
      {
        price: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      _count: {
        select: {
          memberships: true,
        },
      },
    },
  });

  const activeCount = services.filter((service) => service.active).length;
  const inactiveCount = services.length - activeCount;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title="Services"
        description="Manage the personal-training services shown on the public website. Changes here can be published directly to the front end."
        actions={
          <Button href="/services" variant="outline">
            View public services
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
              Total services
            </p>

            <p className="mt-3 text-4xl font-black text-zinc-950">
              {services.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
              Published
            </p>

            <p className="mt-3 text-4xl font-black text-emerald-600">
              {activeCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
              Hidden
            </p>

            <p className="mt-3 text-4xl font-black text-amber-600">
              {inactiveCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Section
        title="Create service"
        description="Add a coaching offer such as 1-to-1 PT, online coaching, a transformation package or a consultation."
      >
        <form action={createService} className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Service name
            </span>

            <input
              type="text"
              name="name"
              required
              placeholder="1-to-1 Personal Training"
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Price
            </span>

            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              required
              placeholder="45.00"
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Duration in days
            </span>

            <input
              type="number"
              name="durationDays"
              min="1"
              step="1"
              required
              placeholder="30"
              className={inputClasses}
            />

            <span className="mt-2 block text-xs text-zinc-500">
              Use 1 for a single session, 30 for a monthly service, or the full
              package duration.
            </span>
          </label>

          <label className="flex items-center gap-3 self-end rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <input
              type="checkbox"
              name="active"
              defaultChecked
              className="h-5 w-5 rounded border-zinc-300 text-red-600 focus:ring-red-500"
            />

            <span>
              <span className="block font-bold text-zinc-950">
                Publish immediately
              </span>

              <span className="block text-sm text-zinc-600">
                Show this service on the public website.
              </span>
            </span>
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Description
            </span>

            <textarea
              name="description"
              placeholder="Explain who the service is for, what is included and the result it helps clients achieve."
              className={textareaClasses}
            />
          </label>

          <div className="lg:col-span-2">
            <Button type="submit" size="lg">
              Create service
            </Button>
          </div>
        </form>
      </Section>

      <Section
        title="Manage services"
        description="Edit pricing and copy, publish or hide offers, and remove services that have never been assigned."
      >
        {services.length === 0 ? (
          <EmptyState
            title="No services yet"
            description="Create your first coaching service above. Published services will be ready to appear on the public website."
          />
        ) : (
          <div className="space-y-6">
            {services.map((service) => {
              const updateAction = updateService.bind(null, service.id);
              const publishAction = toggleService.bind(
                null,
                service.id,
                !service.active,
              );
              const removeAction = deleteService.bind(null, service.id);

              return (
                <Card key={service.id}>
                  <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <CardTitle>{service.name}</CardTitle>

                        <Badge
                          variant={service.active ? "success" : "warning"}
                        >
                          {service.active ? "Published" : "Hidden"}
                        </Badge>
                      </div>

                      <CardDescription>
                        {currencyFormatter.format(Number(service.price))} ·{" "}
                        {formatDuration(service.durationDays)} ·{" "}
                        {service._count.memberships} client{" "}
                        {service._count.memberships === 1
                          ? "assignment"
                          : "assignments"}
                      </CardDescription>
                    </div>

                    <form action={publishAction}>
                      <Button
                        type="submit"
                        variant={service.active ? "outline" : "primary"}
                        size="sm"
                      >
                        {service.active ? "Hide service" : "Publish service"}
                      </Button>
                    </form>
                  </CardHeader>

                  <CardContent>
                    <form
                      action={updateAction}
                      className="grid gap-5 lg:grid-cols-2"
                    >
                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-zinc-700">
                          Service name
                        </span>

                        <input
                          type="text"
                          name="name"
                          required
                          defaultValue={service.name}
                          className={inputClasses}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-zinc-700">
                          Price
                        </span>

                        <input
                          type="number"
                          name="price"
                          min="0"
                          step="0.01"
                          required
                          defaultValue={Number(service.price)}
                          className={inputClasses}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-zinc-700">
                          Duration in days
                        </span>

                        <input
                          type="number"
                          name="durationDays"
                          min="1"
                          step="1"
                          required
                          defaultValue={service.durationDays}
                          className={inputClasses}
                        />
                      </label>

                      <label className="flex items-center gap-3 self-end rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                        <input
                          type="checkbox"
                          name="active"
                          defaultChecked={service.active}
                          className="h-5 w-5 rounded border-zinc-300 text-red-600 focus:ring-red-500"
                        />

                        <span>
                          <span className="block font-bold text-zinc-950">
                            Published
                          </span>

                          <span className="block text-sm text-zinc-600">
                            Keep this service visible on the public website.
                          </span>
                        </span>
                      </label>

                      <label className="block lg:col-span-2">
                        <span className="mb-2 block text-sm font-bold text-zinc-700">
                          Description
                        </span>

                        <textarea
                          name="description"
                          defaultValue={service.description ?? ""}
                          className={textareaClasses}
                        />
                      </label>

                      <div className="flex flex-wrap items-center justify-between gap-3 lg:col-span-2">
                        <Button type="submit">
                          Save service
                        </Button>

                        <p className="text-sm text-zinc-500">
                          Changes refresh the admin and public service pages.
                        </p>
                      </div>
                    </form>

                    <div className="mt-6 border-t border-zinc-200 pt-6">
                      <form action={removeAction}>
                        <Button
                          type="submit"
                          variant="danger"
                          size="sm"
                          disabled={service._count.memberships > 0}
                        >
                          Delete service
                        </Button>
                      </form>

                      {service._count.memberships > 0 ? (
                        <p className="mt-2 text-sm text-zinc-500">
                          This service is assigned to clients, so it can be
                          hidden but not deleted.
                        </p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </PageContainer>
  );
}