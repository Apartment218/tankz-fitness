import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const planId = String(formData.get("planId") ?? "").trim();

    if (!planId) {
      return NextResponse.redirect(
        new URL("/services?error=missing-plan", request.url),
        303,
      );
    }

    const plan = await prisma.membershipPlan.findFirst({
      where: {
        id: planId,
        active: true,
      },
    });

    if (!plan) {
      return NextResponse.redirect(
        new URL("/services?error=plan-not-found", request.url),
        303,
      );
    }

    const amountInPence = Math.round(Number(plan.price) * 100);

    if (!Number.isInteger(amountInPence) || amountInPence < 50) {
      return NextResponse.redirect(
        new URL("/services?error=invalid-price", request.url),
        303,
      );
    }

    const configuredSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

    const siteUrl = configuredSiteUrl || request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      submit_type: "subscribe",
      success_url: `${siteUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/services?cancelled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: amountInPence,
            recurring: {
              interval: "month",
            },
            product_data: {
              name: plan.name,
              description:
                plan.description ??
                "Monthly coaching subscription from Tankz Fitness.",
              metadata: {
                membershipPlanId: plan.id,
              },
            },
          },
        },
      ],
      metadata: {
        membershipPlanId: plan.id,
      },
      subscription_data: {
        metadata: {
          membershipPlanId: plan.id,
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.redirect(
      new URL("/services?error=checkout", request.url),
      303,
    );
  }
}