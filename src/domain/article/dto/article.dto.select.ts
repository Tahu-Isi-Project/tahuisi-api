import z from "zod";
import { articleEntitySchema } from "@article/article.entity";

export const headlineSelectDto = articleEntitySchema
  .pick({
    slug: true,
    title: true,
    excerpt: true,
  })
  .extend({
    rawThumbnailSrc: z.nullable(z.url()),
    thumbnailAlt: z.nullable(z.string()),
    thumbhash: z.nullable(z.string()),
  });

export const articleSelectDto = z.object({
  article: articleEntitySchema
    .pick({
      slug: true,
      publishedAt: true,
      updatedAt: true,
      body: true,
      excerpt: true,
      title: true,
    })
    .extend({
      rawThumbnailSrc: z.nullable(z.url()),
      thumbnailAlt: z.nullable(z.string()),
      thumbhash: z.nullable(z.string()),
    }),
  authorNames: z.array(z.string().min(1)).min(1),
});
