import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  PageContainer,
  PageHeader,
  Section,
} from "@/components/tankz-ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { prisma } from "@/lib/prisma";

import { updatePublicTeamMember } from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100";
const textarea =
  "min-h-28 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100";

export default async function WebsiteTeamPage() {
  const team = await prisma.staff.findMany({
    where: {
      active: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        firstName: "asc",
      },
    ],
  });

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title="Public team"
        description="Choose which staff members appear on the public website and manage their coach profiles."
        actions={
          <>
            <Button href="/admin/staff" variant="outline">
              Manage staff
            </Button>

            <Button href="/" variant="outline">
              View website
            </Button>
          </>
        }
      />

      <Section
        title="Coach profiles"
        description="Only active staff members are shown here. Use the Team section to add or deactivate staff."
      >
        {team.length === 0 ? (
          <EmptyState
            title="No active staff"
            description="Add an active staff member before creating a public coach profile."
          />
        ) : (
          <div className="space-y-6">
            {team.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>
                        {member.firstName} {member.lastName}
                      </CardTitle>

                      <CardDescription>
                        {member.role.replaceAll("_", " ")}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          member.publicProfile ? "success" : "neutral"
                        }
                      >
                        {member.publicProfile ? "Public" : "Private"}
                      </Badge>

                      {member.featured ? (
                        <Badge variant="warning">Featured</Badge>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <form
                    action={updatePublicTeamMember.bind(null, member.id)}
                    className="grid gap-5 lg:grid-cols-2"
                  >
                    <input
                      name="jobTitle"
                      defaultValue={member.jobTitle ?? ""}
                      placeholder="Public job title"
                      className={input}
                    />

                    <input
                      type="number"
                      name="sortOrder"
                      defaultValue={member.sortOrder}
                      placeholder="Display order"
                      className={input}
                    />

                    <textarea
                      name="bio"
                      defaultValue={member.bio ?? ""}
                      placeholder="Public biography"
                      className={`${textarea} lg:col-span-2`}
                    />

                    <textarea
                      name="specialities"
                      defaultValue={member.specialities ?? ""}
                      placeholder="Specialities, one per line"
                      className={textarea}
                    />

                    <textarea
                      name="qualifications"
                      defaultValue={member.qualifications ?? ""}
                      placeholder="Qualifications, one per line"
                      className={textarea}
                    />

                    <input
                      type="url"
                      name="instagramUrl"
                      defaultValue={member.instagramUrl ?? ""}
                      placeholder="Instagram URL"
                      className={input}
                    />

                    <input
                      name="bookingHref"
                      defaultValue={member.bookingHref ?? ""}
                      placeholder="Booking link, e.g. /#contact"
                      className={input}
                    />

                    <div className="lg:col-span-2">
                      <ImageUpload
                        name="imageUrl"
                        label="Coach photo"
                        folder="team"
                        initialUrl={member.imageUrl}
                        description="Use a clear portrait image. A vertical image works best."
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 lg:col-span-2">
                      <label className="flex items-center gap-2 font-bold">
                        <input
                          type="checkbox"
                          name="publicProfile"
                          defaultChecked={member.publicProfile}
                        />
                        Publish profile
                      </label>

                      <label className="flex items-center gap-2 font-bold">
                        <input
                          type="checkbox"
                          name="showOnHome"
                          defaultChecked={member.showOnHome}
                        />
                        Show on homepage
                      </label>

                      <label className="flex items-center gap-2 font-bold">
                        <input
                          type="checkbox"
                          name="featured"
                          defaultChecked={member.featured}
                        />
                        Featured coach
                      </label>
                    </div>

                    <div className="lg:col-span-2">
                      <Button type="submit">
                        Save public profile
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </PageContainer>
  );
}