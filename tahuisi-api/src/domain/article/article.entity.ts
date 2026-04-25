import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { articles } from "./db/article.db.schema";

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
  id: z.uuidv7(),
  slug: articleSlugSchema,
  title: z.string().min(1).max(100),
  excerpt: z.string().min(1).max(200),
  content: z.string(),
  status: articleStatusEnum.default("DRAFT"),
  thumbnailId: z.uuidv7().nullable(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  isLive: z.boolean().default(false),
});

// export const headlineBaseSchema = articleBaseSchema.pick({
//   slug: true,
//   title: true,
//   excerpt: true,
// });

// export const headlineFullSchema = headlineBaseSchema.extend({
//   // from Media Service
//   thumbnail: MediaAssetContract.nullable(),
//   // from Identity Service
//   authorNames: z.array(z.string()).min(1),
// });

// export const ArticleInsertSchema = articleBaseSchema.pick({
//   title: true,
//   slug: true,
//   excerpt: true,
//   content: true,
// }).extend({
//   thumbnailId: z.uuidv7().nullable(),
//   authorIds: z.array(z.uuidv7()).min(1)
// });
