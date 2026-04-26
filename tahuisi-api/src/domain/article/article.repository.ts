import { and, desc, eq } from "drizzle-orm";
import { articleAuthors, articles } from "@article/db/article.db.schema";
import { articleDb } from "@article/db/article.db.client";
import { ArticleInsert } from "@article/article.types";
import { randomUUIDv7 } from "bun";

export default class ArticleRepository {
  async findLatestHeadlinesBase(limit: number) {
    return await articleDb
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
  }

  async createArticle(articleData: ArticleInsert) {
    await articleDb.transaction(async (tx) => {
      const articleId = randomUUIDv7();

      await tx.insert(articles).values({
        articleId: articleId,
        slug: articleData.article.slug,
        title: articleData.article.title,
        excerpt: articleData.article.excerpt,
        body: articleData.article.body,
        status: articleData.article.status,
        thumbnailId: articleData.article.thumbnailId,
        publishedAt: articleData.article.publishedAt,
        isLive: articleData.article.isLive,
      });

      const authorRows = articleData.authorIds.map((authorId) => ({
        articleId: articleId,
        authorId: authorId,
      }));

      await tx.insert(articleAuthors).values(authorRows);
    });
  }

  async findArticleBase(slug: string) {
    return await articleDb
      .select({
        articleId: articles.articleId,
        slug: articles.slug,
        title: articles.title,
        excerpt: articles.excerpt,
        publishedAt: articles.publishedAt,
        updatedAt: articles.updatedAt,
        thumbnailId: articles.thumbnailId,
        status: articles.status,
        body: articles.body,
      })
      .from(articles)
      .where(and(eq(articles.slug, slug)));
  }

  async softDeleteArticle(slug: string) {
    await articleDb
      .update(articles)
      .set({
        isLive: false,
        status: "ARCHIVED",
      })
      .where(eq(articles.slug, slug));
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

  // async updateArticle(slug: string, articleUpdateData: ArticleUpdate): Promise<ArticleUpdate[]> {
  //   return await this.db
  //     .update(articles)
  //     .set(articleUpdateData)
  //     .where(eq(articles.slug, slug))
  //     .returning();
  // }

  // async permanentDeleteArticle(slug: string): Promise<string | null> {
  //   const [deletedArticleSlug] = await this.db
  //     .delete(articles)
  //     .where(eq(articles.slug, slug))
  //     .returning({ slug: articles.slug });

  //   return deletedArticleSlug.slug ?? null;
  // }
}
