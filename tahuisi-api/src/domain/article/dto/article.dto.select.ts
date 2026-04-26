import z from "zod";
import { articleEntitySchema } from "@article/article.entity";

export const headlineSelectDto = articleEntitySchema
  .pick({
    slug: true,
    title: true,
    excerpt: true,
  })
  .extend({
    thumbnailSrc: z.nullable(z.url()),
    thumbnailAlt: z.nullable(z.string()),
  });

export const articleSelectDto = articleEntitySchema;
