import Link from "next/link";

import { prisma } from "@/lib/prisma";

export async function FaqSection() {
  const faqs =
    await prisma.frequentlyAskedQuestion.findMany({
      where: {
        active: true,
        showOnHome: true,
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 6,
    });

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-600">
            Frequently asked questions
          </p>

          <h2 className="mt-5 font-display text-5xl leading-[0.95] text-zinc-950 sm:text-6xl">
            Everything you need to know before getting started.
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Still unsure? Book a consultation and we can talk
            through your goals, schedule and the right level of
            support.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-600"
            >
              View all questions
            </Link>

            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-zinc-950 transition hover:border-red-600 hover:text-red-600"
            >
              Ask a question
            </Link>
          </div>
        </div>

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
      </div>
    </section>
  );
}