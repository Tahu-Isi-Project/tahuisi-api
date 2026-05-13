import z from "zod";

const ArticleSlug = z
  .string()
  .min(2)
  .max(100)
  .toLowerCase()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message:
      "Must start and end with a letter or a number, only lowercase, and only '-' symbol.",
  })
  .describe("Slug for the article URL");

const articleStatusEnum = z.enum([
  "draft",
  "pending_review",
  "published",
  "archived",
]);

const articleSchema = z.object({
  slug: ArticleSlug
    .refine((slug) => slug !== "headline" && slug !== "headlines", {
      error: "Provided slug will conflict with an endpoint with same name."
    }),
  title: z.string().min(1).max(100),
  excerpt: z.string().min(1).max(200),
  body: z.string(),
  status: articleStatusEnum.default("draft"),
  thumbnailId: z.uuidv7().nullable(),
  publishedAt: z.date().optional(),
  isLive: z.boolean().default(false),
});

export const articleInsertDto = z.object({
  article: articleSchema,
  authorIds: z.array(z.uuidv7()),
});

export const articleUpdateDto = z.object({
  article: articleSchema.partial().optional(),
  authorIds: z.array(z.uuidv7()).optional(),
});