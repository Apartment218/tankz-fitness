import {
  Button,
  MetricCard,
  PageContainer,
  PageHeader,
  Section,
  StatGrid,
} from "@/components/tankz-ui";
import { prisma } from "@/lib/prisma";

import ClassCatalogue from "./ClassCatalogue";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const [classes, totalClasses, activeClasses, totalSessions] =
    await Promise.all([
      prisma.fitnessClass.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          _count: {
            select: {
              sessions: true,
            },
          },
          sessions: {
            orderBy: {
              startsAt: "desc",
            },
            take: 1,
            include: {
              trainer: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),

      prisma.fitnessClass.count(),

      prisma.fitnessClass.count({
        where: {
          active: true,
        },
      }),

      prisma.classSession.count(),
    ]);

  const catalogueClasses = classes.map((fitnessClass) => {
    const latestSession = fitnessClass.sessions[0];

    return {
      id: fitnessClass.id,
      name: fitnessClass.name,
      description:
        fitnessClass.description ?? "No description has been added.",
      durationMin: fitnessClass.durationMin,
      capacity: fitnessClass.capacity,
      active: fitnessClass.active,
      sessionCount: fitnessClass._count.sessions,
      latestTrainer: latestSession?.trainer
        ? `${latestSession.trainer.firstName} ${latestSession.trainer.lastName}`
        : null,
      latestSessionAt: latestSession?.startsAt.toISOString() ?? null,
    };
  });

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Coaching"
        title="Classes"
        description="Create and manage group training classes, session capacity and class availability."
        actions={
          <>
            <Button href="/admin/classes/new">
              Add class
            </Button>

            <Button href="/admin" variant="outline">
              Back to dashboard
            </Button>
          </>
        }
      />

      <StatGrid>
        <MetricCard
          label="Total classes"
          value={totalClasses.toLocaleString("en-GB")}
          description="All class types"
          tone="purple"
        />

        <MetricCard
          label="Active classes"
          value={activeClasses.toLocaleString("en-GB")}
          description="Currently available"
          tone="green"
        />

        <MetricCard
          label="Scheduled sessions"
          value={totalSessions.toLocaleString("en-GB")}
          description="All class-session records"
          tone="blue"
        />

        <MetricCard
          label="Inactive classes"
          value={(totalClasses - activeClasses).toLocaleString("en-GB")}
          description="Hidden or paused"
          tone="amber"
        />
      </StatGrid>

      <Section
        title="Class catalogue"
        description="Search and review every class stored in Tankz HQ."
        contentClassName="p-0"
      >
        <ClassCatalogue classes={catalogueClasses} />
      </Section>
    </PageContainer>
  );
}