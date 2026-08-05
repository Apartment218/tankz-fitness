import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function SubscriptionSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
  }>;
}) {
  const { session_id: sessionId } = await searchParams;

  const session = sessionId
    ? await stripe.checkout.sessions
        .retrieve(sessionId)
        .catch(() => null)
    : null;

  const customerEmail =
    session?.customer_details?.email ?? null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(220,38,38,.38),transparent_30%)]" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-4xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-3xl font-black">
              ✓
            </div>

            <p className="mt-7 text-sm font-black uppercase tracking-[0.3em] text-red-400">
              Subscription confirmed
            </p>

            <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl">
              Welcome to Tankz Fitness.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Your monthly coaching subscription has been
              created successfully.
              {customerEmail
                ? ` A confirmation has been sent to ${customerEmail}.`
                : ""}
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="rounded-full bg-red-600 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500"
              >
                Return home
              </Link>

              <Link
                href="/services"
                className="rounded-full border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white hover:text-zinc-950"
              >
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}