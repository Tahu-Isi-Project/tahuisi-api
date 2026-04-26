import z from "zod";
import { articleEntitySchema } from "@article/article.entity";

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
