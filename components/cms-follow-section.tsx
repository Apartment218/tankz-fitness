import { prisma } from "@/lib/prisma";

export async function CmsFollowSection() {
  const [content, settings] = await Promise.all([
    prisma.homepageContent.findUnique({
      where: {
        id: "main",
      },
    }),

    prisma.siteSettings.findUnique({
      where: {
        id: "main",
      },
    }),
  ]);

  if (content && !content.followVisible) {
    return null;
  }

  const socialLinks = [
    {
      label: "Instagram",
      href: settings?.instagramUrl,
    },
    {
      label: "Facebook",
      href: settings?.facebookUrl,
    },
    {
      label: "YouTube",
      href: settings?.youtubeUrl,
    },
    {
      label: "TikTok",
      href: settings?.tiktokUrl,
    },
  ].filter(
    (link): link is { label: string; href: string } =>
      Boolean(link.href),
  );

  if (
    !content?.followEyebrow &&
    !content?.followTitle &&
    !content?.followBody &&
    socialLinks.length === 0
  ) {
    return null;
  }

  return (
    <section className="bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        {content?.followEyebrow ? (
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">
            {content.followEyebrow}
          </p>
        ) : null}

        <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl tracking-tight sm:text-5xl">
          {content?.followTitle ?? "Follow the journey"}
        </h2>

        {content?.followBody ? (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            {content.followBody}
          </p>
        ) : null}

        {socialLinks.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-black uppercase tracking-wider transition hover:border-red-500 hover:bg-red-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}