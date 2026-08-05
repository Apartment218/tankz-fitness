import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageContainer,
  PageHeader,
} from "@/components/tankz-ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WebsiteOverviewPage() {
  const [
    settings,
    homepage,
    publishedServices,
    totalPages,
    publishedPages,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: {
        id: "main",
      },
    }),

    prisma.homepageContent.findUnique({
      where: {
        id: "main",
      },
    }),

    prisma.membershipPlan.count({
      where: {
        active: true,
      },
    }),

    prisma.websitePage.count(),

    prisma.websitePage.count({
      where: {
        published: true,
      },
    }),
  ]);

  const cards = [
    {
      title: "Homepage",
      description:
        "Edit the hero, about, services and social sections shown on the homepage.",
      href: "/admin/website/homepage",
      status: homepage ? "Connected" : "Needs setup",
      ready: Boolean(homepage),
    },
    {
      title: "Branding & settings",
      description:
        "Manage the business name, logo, contact details, social links and footer.",
      href: "/admin/website/settings",
      status: settings ? "Connected" : "Needs setup",
      ready: Boolean(settings),
    },
    {
      title: "Services",
      description:
        "Control service pricing, visibility, homepage placement and popular offers.",
      href: "/admin/services",
      status: `${publishedServices} published`,
      ready: publishedServices > 0,
    },
    {
      title: "Pages",
      description:
        "Create public pages and choose whether they appear in the header or footer.",
      href: "/admin/website/pages",
      status: `${publishedPages} of ${totalPages} published`,
      ready: totalPages > 0,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title="Website"
        description="Manage the public Tankz Fitness website from one place. Changes saved here are read directly by the live site."
        actions={
          <Button href="/" variant="outline">
            View live website
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>{card.title}</CardTitle>

                <Badge variant={card.ready ? "success" : "warning"}>
                  {card.status}
                </Badge>
              </div>

              <CardDescription>{card.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button href={card.href}>
                Manage {card.title.toLowerCase()}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-950 text-white">
        <CardContent className="grid gap-6 p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Live connection
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Admin changes now power the public website
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
              Homepage content, services and website settings are stored in
              Prisma. The next CMS sections will add page creation, dynamic
              navigation, image uploads, testimonials and transformations.
            </p>
          </div>

          <Button href="/admin/website/homepage" size="lg">
            Edit homepage
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}