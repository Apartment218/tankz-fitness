import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import {
  MembershipStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type StripeCustomerDetails = {
  email: string;
  name: string | null;
  stripeCustomerId: string | null;
};

function splitName(fullName: string | null) {
  const cleanedName = fullName?.trim() || "Stripe Customer";
  const parts = cleanedName.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || "Stripe",
    lastName:
      parts.length > 1
        ? parts.slice(1).join(" ")
        : "Customer",
  };
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getSubscriptionId(invoice: Stripe.Invoice) {
  const legacySubscription = (
    invoice as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    }
  ).subscription;

  if (typeof legacySubscription === "string") {
    return legacySubscription;
  }

  if (
    legacySubscription &&
    typeof legacySubscription === "object"
  ) {
    return legacySubscription.id;
  }

  const parent = (
    invoice as Stripe.Invoice & {
      parent?: {
        subscription_details?: {
          subscription?:
            | string
            | Stripe.Subscription
            | null;
        } | null;
      } | null;
    }
  ).parent;

  const parentSubscription =
    parent?.subscription_details?.subscription;

  if (typeof parentSubscription === "string") {
    return parentSubscription;
  }

  if (
    parentSubscription &&
    typeof parentSubscription === "object"
  ) {
    return parentSubscription.id;
  }

  return null;
}

async function getCustomerDetails(
  customer:
    | string
    | Stripe.Customer
    | Stripe.DeletedCustomer
    | null,
): Promise<StripeCustomerDetails | null> {
  if (!customer) {
    return null;
  }

  const customerObject =
    typeof customer === "string"
      ? await stripe.customers.retrieve(customer)
      : customer;

  if (customerObject.deleted || !customerObject.email) {
    return null;
  }

  return {
  email: customerObject.email.toLowerCase().trim(),
  name: customerObject.name ?? null,
  stripeCustomerId: customerObject.id,
};
}

async function findOrCreateMember(
  customer: StripeCustomerDetails,
) {
  const existingMember = await prisma.member.findUnique({
    where: {
      email: customer.email,
    },
  });

  if (existingMember) {
    return existingMember;
  }

  const name = splitName(customer.name);

  return prisma.member.create({
    data: {
      firstName: name.firstName,
      lastName: name.lastName,
      email: customer.email,
    },
  });
}

async function activateMembership({
  memberId,
  planId,
  startDate,
  endDate,
}: {
  memberId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
}) {
  const existingMembership =
    await prisma.membership.findFirst({
      where: {
        memberId,
        planId,
        status: {
          in: [
            MembershipStatus.ACTIVE,
            MembershipStatus.PAUSED,
          ],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  if (existingMembership) {
    return prisma.membership.update({
      where: {
        id: existingMembership.id,
      },
      data: {
        status: MembershipStatus.ACTIVE,
        startDate,
        endDate,
      },
    });
  }

  return prisma.membership.create({
    data: {
      memberId,
      planId,
      status: MembershipStatus.ACTIVE,
      startDate,
      endDate,
    },
  });
}

async function pauseMembership(
  memberId: string,
  planId: string,
) {
  const membership = await prisma.membership.findFirst({
    where: {
      memberId,
      planId,
      status: MembershipStatus.ACTIVE,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!membership) {
    return;
  }

  await prisma.membership.update({
    where: {
      id: membership.id,
    },
    data: {
      status: MembershipStatus.PAUSED,
    },
  });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
) {
  const planId = session.metadata?.membershipPlanId;

  if (!planId) {
    return;
  }

  const email = session.customer_details?.email
    ?.toLowerCase()
    .trim();

  if (!email) {
    return;
  }

  const member =
    (await prisma.member.findUnique({
      where: {
        email,
      },
    })) ??
    (await prisma.member.create({
      data: {
        ...splitName(session.customer_details?.name ?? null),
        email,
      },
    }));

  const plan = await prisma.membershipPlan.findUnique({
    where: {
      id: planId,
    },
  });

  if (!plan) {
    return;
  }

  const now = new Date();

  await activateMembership({
    memberId: member.id,
    planId: plan.id,
    startDate: now,
    endDate: addDays(now, plan.durationDays),
  });
}

async function handleInvoice(
  invoice: Stripe.Invoice,
  status: PaymentStatus,
) {
  const subscriptionId = getSubscriptionId(invoice);

  if (!subscriptionId) {
    return;
  }

  const subscription =
    await stripe.subscriptions.retrieve(subscriptionId);

  const planId =
    subscription.metadata.membershipPlanId?.trim();

  if (!planId) {
    return;
  }

  const [plan, customer] = await Promise.all([
    prisma.membershipPlan.findUnique({
      where: {
        id: planId,
      },
    }),
    getCustomerDetails(subscription.customer),
  ]);

  if (!plan || !customer) {
    return;
  }

  const member = await findOrCreateMember(customer);
  const paidAtTimestamp =
    invoice.status_transitions.paid_at;
  const paidAt =
    status === PaymentStatus.PAID
      ? paidAtTimestamp
        ? new Date(paidAtTimestamp * 1000)
        : new Date()
      : null;

  const amountInMinorUnits =
    status === PaymentStatus.PAID
      ? invoice.amount_paid
      : invoice.amount_due;

  await prisma.payment.upsert({
    where: {
      reference: invoice.id,
    },
    create: {
      memberId: member.id,
      amount: (amountInMinorUnits / 100).toFixed(2),
      currency: invoice.currency.toUpperCase(),
      status,
      method: PaymentMethod.CARD,
      reference: invoice.id,
      description: `${plan.name} monthly subscription`,
      paidAt,
    },
    update: {
      memberId: member.id,
      amount: (amountInMinorUnits / 100).toFixed(2),
      currency: invoice.currency.toUpperCase(),
      status,
      method: PaymentMethod.CARD,
      description: `${plan.name} monthly subscription`,
      paidAt,
    },
  });

  const now = new Date();

  if (status === PaymentStatus.PAID) {
    const periodEnd =
      "current_period_end" in subscription &&
      typeof subscription.current_period_end === "number"
        ? new Date(subscription.current_period_end * 1000)
        : addDays(now, plan.durationDays);

    await activateMembership({
      memberId: member.id,
      planId: plan.id,
      startDate: now,
      endDate: periodEnd,
    });
  } else {
    await pauseMembership(member.id, plan.id);
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is missing from the environment.",
    );

    return NextResponse.json(
      {
        error: "Webhook secret is not configured.",
      },
      {
        status: 500,
      },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        error: "Missing Stripe signature.",
      },
      {
        status: 400,
      },
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Invalid webhook signature.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "invoice.paid":
        await handleInvoice(
          event.data.object as Stripe.Invoice,
          PaymentStatus.PAID,
        );
        break;

      case "invoice.payment_failed":
        await handleInvoice(
          event.data.object as Stripe.Invoice,
          PaymentStatus.FAILED,
        );
        break;

      default:
        break;
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      `Stripe webhook handler failed for ${event.type}:`,
      error,
    );

    return NextResponse.json(
      {
        error: "Webhook handler failed.",
      },
      {
        status: 500,
      },
    );
  }
}