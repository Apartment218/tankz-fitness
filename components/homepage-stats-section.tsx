import { prisma } from "@/lib/prisma";

export async function HomepageStatsSection() {
  const content = await prisma.homepageContent.findUnique({
    where: { id: "main" },
  });

  if (!content?.statsVisible) {
    return null;
  }

  const stats = [
    [content.statOneValue, content.statOneLabel],
    [content.statTwoValue, content.statTwoLabel],
    [content.statThreeValue, content.statThreeLabel],
    [content.statFourValue, content.statFourLabel],
  ].filter(
    (item): item is [string, string] =>
      Boolean(item[0] && item[1]),
  );

  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
              {content.statsEyebrow ?? "Built for measurable progress"}
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl leading-[0.95] sm:text-5xl">
              {content.statsTitle ??
                "Coaching that turns effort into results"}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map(([value, label]) => (
              <div
                key={`${value}-${label}`}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="font-display text-4xl text-white">
                  {value}
                </p>
                <p className="mt-2 text-xs font-black uppercase tracking-wider text-zinc-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}