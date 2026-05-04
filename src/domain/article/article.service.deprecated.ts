// import { HTTPException } from "hono/http-exception";
// import ArticleRepository from "./article.repository";
// import {
//   Article,
//   ArticleInsert,
//   ArticleUpdate,
//   Author,
//   authorSchema,
//   Headline,
//   Thumbnail,
//   thumbnailSchema,
// } from "./article.dto";
// import { ServerError } from "@common/error";

// import z from "zod";

// class ArticleService {
//   private repo: ArticleRepository;
//   constructor(articleRepository: ArticleRepository) {
//     this.repo = articleRepository;
//   }

//   private async attachThumbnail<T extends { thumbnailId: string | null }>(
//     items: T[]
//   ): Promise<(T & { thumbnail: Thumbnail | null })[]> {
//     const ids = [
//       ...new Set(items.map(i => i.thumbnailId).filter(Boolean))
//     ];

//     if (ids.length === 0)
//       return items.map(item => ({ ...item, thumbnail: null }));

//     const queryParams = new URLSearchParams({ 
//       fields: "src,alt_text", 
//       ids: ids.join(',') 
//     });

//     const response = await this.mediaService.fetch(
//       `https://media.service/query?${queryParams}`
//     );
//     const rawData = await response.json();
    
//     const result = z.array(thumbnailSchema).safeParse(rawData);
//     if (!result.success) throw new ServerError("Media service validation failed");

//     const thumbnailMap = new Map<string, Thumbnail>(
//       result.data
//         .filter((thumbnail): thumbnail is NonNullable<typeof thumbnail> => thumbnail !== null)
//         .map(thumbnail => [thumbnail.id, thumbnail])
//     );

//     return items.map(item => ({
//       ...item,
//       thumbnail: item.thumbnailId 
//         ? (thumbnailMap.get(item.thumbnailId) ?? null) 
//         : null
//     }));
//   }

//   private async attachAuthors<T extends { id: string }>(
//     items: T[]
//   ): Promise<(T & { authors: Author[] })[]> {
//     const itemIds = items.map(i => i.id);
//     const authorMapping = await this.repo.getAuthorIds(itemIds);
    
//     const uniqueAuthorIds = [...new Set(Object.values(authorMapping).flat())];
    
//     if (uniqueAuthorIds.length === 0)
//       return items.map(item => ({ ...item, authors: [] }));

//     const queryParams = new URLSearchParams({ 
//       fields:  "id,name,avatar_src",
//       ids: uniqueAuthorIds.join(',') 
//     });

//     const response = await this.userService.fetch(
//       `https://user.service/query?${queryParams}`
//     );
//     const rawData = await response.json();

//     const result = z.array(authorSchema).safeParse(rawData);

//     if (!result.success)
//       throw new ServerError("User service validation failed");

//     const authorMap = new Map<string, Author>(
//       result.data.map((author) => [author.id, author])
//     );

//     return items.map((item) => {
//       const authorIdsForThisItem = authorMapping[item.id] || [];
//       const authors = authorIdsForThisItem
//         .map(id => authorMap.get(id))
//         .filter((a): a is Author => !a); // Remove any that weren't found in User Service

//       return { ...item, authors };
//     });
//   }

//   private async attachThumbnailAndAuthors<
//     T extends { thumbnailId: string | null } & { id: string }
//   >(items: T[]) {
//     const [withThumbnails, authorMappings] = await Promise.all([
//       this.attachThumbnail(items),
//       this.attachAuthors(items)
//     ]);

//     return withThumbnails.map((item, index) => ({
//       ...item,
//       authors: authorMappings[index].authors
//     }));
//   }

//   async getHeadlines(limit: number): Promise<Headline[]> {
//     const baseHeadlines = await this.repo.getLatestHeadlinesBase(limit);

//     if (!baseHeadlines.length)
//       throw new HTTPException(404, { message: "No headlines found." });

//     return await this.attachThumbnailAndAuthors(baseHeadlines);
//   }

//   async getArticle(slug: string): Promise<Article> {
//     const baseArticle = await this.repo.getArticleBase(slug);
    
//     if (!baseArticle.length) throw new ArticleNotFoundError(slug);

//     return await this
//       .attachThumbnailAndAuthors(baseArticle)
//       .then((article) => article[0]);
//   }

//   async createArticle(articleData: ArticleInsert): Promise<ArticleInsert> {
//     const articles = await this.repo.createArticle(articleData);

//     if (!articles.length)
//       throw new HTTPException(409, { 
//         message: `Slug '${articleData.slug}' already exists.` 
//       });

//     return articles[0];
//   }

//   async deleteArticle(slug: string, permanent?: boolean): Promise<string> {
//     const deletedSlug = await (permanent
//       ? this.repo.permanentDeleteArticle(slug)
//       : this.repo.softDeleteArticle(slug));

//     if (!deletedSlug) throw new ArticleNotFoundError(slug);

//     return deletedSlug;
//   }

//   async updateArticle(slug: string, article: ArticleUpdate) {
//     try {
//       const updatedSlug = await this.repo.updateArticle(slug, article);

//       if (!updatedSlug) throw new ArticleNotFoundError(slug);

//       return updatedSlug;
//     } catch (err: any) {
//       if (err.cause?.constraint === "edit_date_guard")
//         throw new HTTPException(422, {
//           message: "Edit date cannot be before or equal to publish date.",
//         });

//       throw err;
//     }
//   }
// }

// export default ArticleService;