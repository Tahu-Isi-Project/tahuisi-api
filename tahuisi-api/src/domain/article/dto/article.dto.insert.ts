import z from "zod";

const ArticleSlug = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message:
      "Must start and end with a letter or a number, only lowercase, and only '-' symbol.",
  })
  .describe("Slug for the article URL");

const articleStatusEnum = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
]);

export const articleInsertDto = z.object({
  article: z.object({
    slug: ArticleSlug,
    title: z.string().min(1).max(100),
    excerpt: z.string().min(1).max(200),
    body: z.string(),
    status: articleStatusEnum.default("DRAFT"),
    thumbnailId: z.uuidv7().nullable(),
    publishedAt: z.date().optional(),
    isLive: z.boolean().default(false),
  }),
  authorIds: z.array(z.uuidv7()),
});
