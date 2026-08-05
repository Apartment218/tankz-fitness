import { notFound } from "next/navigation";

import {
  Button,
  PageContainer,
  PageHeader,
} from "@/components/tankz-ui";
import { prisma } from "@/lib/prisma";

import { ClientForm } from "./ClientForm";

export const dynamic = "force-dynamic";

type EditClientPageProps = {
  params: Promise<{
    memberId: string;
  }>;
};

export default async function EditClientPage({
  params,
}: EditClientPageProps) {
  const { memberId } = await params;

  const client = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      postcode: true,
      emergencyName: true,
      emergencyPhone: true,
      notes: true,
      status: true,
      goal: true,
      goalDescription: true,
      startingWeightKg: true,
      currentWeightKg: true,
      targetWeightKg: true,
      heightCm: true,
      bodyFatPercentage: true,
      consultationDate: true,
      coachNotes: true,
    },
  });

  if (!client) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Client Management"
        title={`Edit ${client.firstName} ${client.lastName}`}
        description="Update personal details, coaching goals, measurements, consultation information and private coach notes."
        actions={
          <Button
            href={`/admin/members/${client.id}`}
            variant="outline"
          >
            View client
          </Button>
        }
      />

      <ClientForm
        client={{
          ...client,
          startingWeightKg:
            client.startingWeightKg?.toString() ?? null,
          currentWeightKg:
            client.currentWeightKg?.toString() ?? null,
          targetWeightKg:
            client.targetWeightKg?.toString() ?? null,
          heightCm: client.heightCm?.toString() ?? null,
          bodyFatPercentage:
            client.bodyFatPercentage?.toString() ?? null,
        }}
      />
    </PageContainer>
  );
}