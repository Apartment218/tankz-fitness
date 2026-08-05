import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Tankz Fitness",
  description:
    "Answers to common questions about personal training, online coaching and getting started with Tankz Fitness.",
};

export default async function FaqPage() {
  const faqs =
    await prisma.frequentlyAskedQuestion.findMany({
      where: {
        active: true,
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          category: "asc",
        },
        {
          sortOrder: "asc",
        },
      ],
    });

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      <SiteHeader />

      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(220,38,38,.34),transparent_26%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
            Frequently asked questions
          </p>

          <h1 className="mt-5 max-w-5xl font-display text-6xl leading-[0.92] sm:text-7xl">
            Clear answers before you take the first step.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
            Learn more about coaching, pricing, experience
            levels and what happens when you get started.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          {faqs.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center text-zinc-600">
              Questions and answers are coming soon.
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={faq.id}
                  open={index === 0}
                  className="group rounded-2xl border border-zinc-200 bg-zinc-50 open:border-red-200 open:bg-red-50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-5">
                    <span>
                      {faq.category ? (
                        <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-red-600">
                          {faq.category}
                        </span>
                      ) : null}

                      <span className="text-lg font-black text-zinc-950">
                        {faq.question}
                      </span>
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xl font-black text-white transition group-open:rotate-45 group-open:bg-red-600">
                      +
                    </span>
                  </summary>

                  <div className="px-6 pb-6">
                    <p className="whitespace-pre-line leading-8 text-zinc-600">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}