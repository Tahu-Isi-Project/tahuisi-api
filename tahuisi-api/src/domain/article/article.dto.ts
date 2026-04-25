import z from "zod";
import { articleEntitySchema } from "./article.entity";

export const headlineDto = articleEntitySchema
  .pick({
    slug: true,
    title: true,
    excerpt: true,
  })
  .extend({
    thumbnailSrc: z.nullable(z.url()),
    thumbnailAlt: z.nullable(z.string()),
  });

// export const ArticleSlug = z
//   .string()
//   .min(2)
//   .max(100)
//   .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
//     message:
//       "Must start and end with a letter or a number, only lowercase, and only '-' symbol.",
//   })
//   .describe("Slug for the article URL");

// const articleStatusEnum = z.enum([
//   "DRAFT",
//   "PENDING_REVIEW",
//   "PUBLISHED",
//   "ARCHIVED",
// ]);

// // From media service
// export const thumbnailSchema = z.object({
//   id: z.uuidv7(),
//   src: z.url().nullable(),
//   altText: z.string().nullable()
// })
// .nullable();
// export type Thumbnail = z.infer<typeof thumbnailSchema>;

// // From identity service
// export const authorSchema = z.object({
//   id: z.uuidv7(),
//   name: z.string().min(1),
//   avatarSrc: z.url().nullable()
// })
// export type Author = z.infer<typeof authorSchema>;

// export const articleInsertDto = z.object({
//   id: z.uuidv7(),
//   slug: ArticleSlug,
//   title: z.string().min(1).max(100),
//   excerpt: z.string().min(1).max(200),
//   content: z.string(),
//   status: articleStatusEnum.default("DRAFT"),
//   thumbnailId: z.uuidv7().nullable(),
//   publishedAt: z.date(),
//   isLive: z.boolean().default(false),
// });
// export type ArticleInsert = z.infer<typeof articleInsertDto>;

// export const articleUpdateDto = articleInsertDto.omit({ publishedAt: true });
// export type ArticleUpdate = z.infer<typeof articleUpdateDto>;

// export const articleBaseSelectDto = articleInsertDto
//   .extend({ updatedAt: z.date().nullable() })
//   .omit({ isLive: true });
// export type ArticleBase = z.infer<typeof articleBaseSelectDto>;

// export const articleSelectDto = articleBaseSelectDto
//   .omit({ thumbnailId: true })
//   .extend({
//     thumbnail: thumbnailSchema,
//     authors: z.array(authorSchema).min(1)
//   });

// export type Article = z.infer<typeof articleSelectDto>;

// export const headlineBaseSelectDto = articleBaseSelectDto
//   .omit({
//     content: true,
//     status: true
//   });
// export type HeadlineBase = z.infer<typeof headlineBaseSelectDto>;

// export const headlineSelectDto = headlineBaseSelectDto
//   .omit({ thumbnailId: true })
//   .extend({
//     thumbnail: thumbnailSchema,
//     authors: z.array(authorSchema).min(1)
//   });

// export type Headline = z.infer<typeof headlineSelectDto>;
