import { prisma } from "@/lib/prisma";

import PaymentManager, {
  type PaymentRecord,
} from "./payment-manager";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const [payments, members] = await Promise.all([
    prisma.payment.findMany({
      include: {
        member: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.member.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: [
        {
          lastName: "asc",
        },
        {
          firstName: "asc",
        },
      ],
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    }),
  ]);

  const initialPayments: PaymentRecord[] = payments.map(
    (payment) => ({
      id: payment.id,
      memberId: payment.memberId,
      memberName: payment.member
        ? `${payment.member.firstName} ${payment.member.lastName}`
        : null,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      reference: payment.reference,
      description: payment.description,
      paidAt: payment.paidAt?.toISOString() ?? null,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    })
  );

  return (
    <PaymentManager
      initialPayments={initialPayments}
      members={members}
    />
  );
}