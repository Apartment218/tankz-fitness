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
import { prisma } from "@/lib/prisma";

import {
  createFaq,
  deleteFaq,
  updateFaq,
} from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textarea =
  "min-h-36 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-zinc-300 text-red-600"
      />

      <span className="font-bold text-zinc-900">
        {label}
      </span>
    </label>
  );
}

export default async function FaqAdminPage() {
  const faqs =
    await prisma.frequentlyAskedQuestion.findMany({
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
    });

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Website CMS"
        title="Frequently asked questions"
        description="Manage answers to common questions and choose which ones appear on the homepage."
        actions={
          <>
            <Button href="/admin/website" variant="outline">
              Website overview
            </Button>

            <Button href="/faq" variant="outline">
              View FAQ page
            </Button>
          </>
        }
      />

      <Section
        title="Add a question"
        description="Create a helpful answer for prospective clients."
      >
        <form
          action={createFaq}
          className="grid gap-5 lg:grid-cols-2"
        >
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Question
            </span>

            <input
              type="text"
              name="question"
              required
              placeholder="Do I need previous gym experience?"
              className={input}
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Answer
            </span>

            <textarea
              name="answer"
              required
              placeholder="Write a clear and helpful answer."
              className={textarea}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Category
            </span>

            <input
              type="text"
              name="category"
              placeholder="Getting started"
              className={input}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Display order
            </span>

            <input
              type="number"
              name="sortOrder"
              defaultValue="0"
              className={input}
            />
          </label>

          <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
            <Toggle
              name="active"
              label="Published"
              defaultChecked
            />

            <Toggle
              name="showOnHome"
              label="Show on homepage"
              defaultChecked
            />

            <Toggle
              name="featured"
              label="Featured question"
              defaultChecked={false}
            />
          </div>

          <div className="lg:col-span-2">
            <Button type="submit" size="lg">
              Add question
            </Button>
          </div>
        </form>
      </Section>

      <Section
        title="Manage questions"
        description={`${faqs.length} question${
          faqs.length === 1 ? "" : "s"
        } stored in Tankz HQ.`}
      >
        {faqs.length === 0 ? (
          <EmptyState
            title="No questions yet"
            description="Add your first frequently asked question above."
          />
        ) : (
          <div className="space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle>{faq.question}</CardTitle>

                      <CardDescription>
                        {faq.category ?? "Uncategorised"}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          faq.active ? "success" : "neutral"
                        }
                      >
                        {faq.active ? "Published" : "Hidden"}
                      </Badge>

                      {faq.showOnHome ? (
                        <Badge variant="info">Homepage</Badge>
                      ) : null}

                      {faq.featured ? (
                        <Badge variant="warning">Featured</Badge>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <form
                    action={updateFaq.bind(null, faq.id)}
                    className="grid gap-5 lg:grid-cols-2"
                  >
                    <label className="block lg:col-span-2">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Question
                      </span>

                      <input
                        type="text"
                        name="question"
                        required
                        defaultValue={faq.question}
                        className={input}
                      />
                    </label>

                    <label className="block lg:col-span-2">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Answer
                      </span>

                      <textarea
                        name="answer"
                        required
                        defaultValue={faq.answer}
                        className={textarea}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Category
                      </span>

                      <input
                        type="text"
                        name="category"
                        defaultValue={faq.category ?? ""}
                        className={input}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-zinc-700">
                        Display order
                      </span>

                      <input
                        type="number"
                        name="sortOrder"
                        defaultValue={faq.sortOrder}
                        className={input}
                      />
                    </label>

                    <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
                      <Toggle
                        name="active"
                        label="Published"
                        defaultChecked={faq.active}
                      />

                      <Toggle
                        name="showOnHome"
                        label="Show on homepage"
                        defaultChecked={faq.showOnHome}
                      />

                      <Toggle
                        name="featured"
                        label="Featured question"
                        defaultChecked={faq.featured}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Button type="submit">
                        Save question
                      </Button>
                    </div>
                  </form>

                  <form
                    action={deleteFaq.bind(null, faq.id)}
                    className="mt-4 border-t border-zinc-200 pt-4"
                  >
                    <Button
                      type="submit"
                      variant="danger"
                      size="sm"
                    >
                      Delete question
                    </Button>
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