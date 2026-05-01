import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { articleAuthors, articles } from "@article/db/schema";

export const articleStatusEnum = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
]);

export const articleSlugSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message:
      "Must start and end with a letter or a number, only lowercase, and only '-' symbol.",
  })
  .describe("Slug for the article URL");

export const articleEntitySchema = createInsertSchema(articles, {
  articleId: z.uuidv7(),
  slug: articleSlugSchema,
  title: z.string().min(1).max(100),
  excerpt: z.string().min(1).max(200),
  body: z.string(),
  status: articleStatusEnum.default("DRAFT"),
  thumbnailId: z.uuidv7().nullable(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  isLive: z.boolean().default(false),
});

export const articleAuthorsEntitySchema = createInsertSchema(articleAuthors, {
  articleId: z.uuidv7(),
  authorId: z.uuidv7(),
});
