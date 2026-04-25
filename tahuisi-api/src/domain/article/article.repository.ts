import { and, desc, eq } from "drizzle-orm";
import { articles } from "./db/article.db.schema";
import { articleDb } from "./db/article.db.client";

export default class ArticleRepository {
  
  async getLatestHeadlinesBase(limit: number) {
    const res = await articleDb
      .select({
        slug: articles.slug,
        title: articles.title,
        excerpt: articles.excerpt,
        thumbnailId: articles.thumbnailId,
      })
      .from(articles)
      .where(and(eq(articles.status, "PUBLISHED"), eq(articles.isLive, true)))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    return res;
  }

  // async getAuthorIds(articleIds: string[]): Promise<Record<string, string[]>> {
  //   const rows = await this.db
  //     .select({ articleId: articleAuthors.articleId, authorId: articleAuthors.authorId })
  //     .from(articleAuthors)
  //     .where(inArray(articleAuthors.articleId, articleIds));

  //   return rows.reduce((acc, row) => {
  //     if (!acc[row.articleId]) acc[row.articleId] = [];
  //     acc[row.articleId].push(row.authorId);
  //     return acc;
  //   }, {} as Record<string, string[]>);
  // }

  // async createArticle(articleData: ArticleInsert): Promise<ArticleInsert[]> {
  //   return await this.db
  //     .insert(articles)
  //     .values({
  //       id: articleData.id || uuidv7(),
  //       slug: articleData.slug,
  //       title: articleData.title,
  //       excerpt: articleData.excerpt,
  //       content: articleData.content,
  //       status: articleData.status,
  //       thumbnailId: articleData.thumbnailId,
  //       publishedAt: articleData.publishedAt,
  //       isLive: articleData.isLive
  //     })
  //     .onConflictDoNothing()
  //     .returning();
  // }

  // async getArticleBase(slug: string): Promise<ArticleBase[]> {
  //   const articleBase = await this.db
  //     .select({
  //       id: articles.id,
  //       slug: articles.slug,
  //       title: articles.title,
  //       excerpt: articles.excerpt,
  //       publishedAt: articles.publishedAt,
  //       updatedAt: articles.updatedAt,
  //       thumbnailId: articles.thumbnailId,
  //       status: articles.status,
  //       content: articles.content,
  //   })
  //   .from(articles)
  //   .where(and(
  //     eq(articles.slug, slug)
  //   ));

  //   return articleBase;
  // }

  // async updateArticle(slug: string, articleUpdateData: ArticleUpdate): Promise<ArticleUpdate[]> {
  //   return await this.db
  //     .update(articles)
  //     .set(articleUpdateData)
  //     .where(eq(articles.slug, slug))
  //     .returning();
  // }

  // async softDeleteArticle(slug: string): Promise<string | null> {
  //   const [deletedArticleSlug] = await this.db
  //     .update(articles)
  //     .set({ isLive: false })
  //     .where(and(
  //       eq(articles.slug, slug),
  //       eq(articles.isLive, true)
  //     ))
  //     .returning({ slug: articles.slug });

  //   return deletedArticleSlug.slug ?? null;
  // }

  // async permanentDeleteArticle(slug: string): Promise<string | null> {
  //   const [deletedArticleSlug] = await this.db
  //     .delete(articles)
  //     .where(eq(articles.slug, slug))
  //     .returning({ slug: articles.slug });

  //   return deletedArticleSlug.slug ?? null;
  // }
}
