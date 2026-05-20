import { and, desc, eq } from "drizzle-orm";
import { articleAuthors, articles } from "@article/db/schema";
import { ArticleInsert, ArticleStatus, ArticleUpdate } from "@article/article.types";
import { randomUUIDv7 } from "bun";
import { articleDb } from "@article/index";

export default class ArticleRepository {
  async findLatestHeadlinesBase(limit: number, status: ArticleStatus) {
    const isLive = status === "published";
    
    return await articleDb
      .select({
        slug: articles.slug,
        title: articles.title,
        excerpt: articles.excerpt,
        thumbnailId: articles.thumbnailId,
      })
      .from(articles)
      .where(and(
        eq(articles.status, status), 
        eq(articles.isLive, isLive)
      ))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async findOneSlug(slug: string) {
    const [result] = await articleDb
      .select({ slug: articles.slug })
      .from(articles)
      .where(eq(articles.slug, slug));
    
    return result;
  }

  async createArticle(articleData: ArticleInsert) {
    await articleDb.transaction(async (tx) => {
      const articleId = randomUUIDv7();
      
      await tx.insert(articles).values({
        articleId,
        slug: articleData.article.slug,
        title: articleData.article.title,
        excerpt: articleData.article.excerpt,
        body: articleData.article.body,
        status: articleData.article.status,
        thumbnailId: articleData.article.thumbnailId,
        publishedAt: articleData.article.publishedAt,
        isLive: articleData.article.isLive,
      });

      const authors = articleData.authorIds.map((authorId) => ({ 
        articleId, 
        authorId
      }));

      await tx.insert(articleAuthors).values(authors);
    });
  }

  async updateArticle(slug: string, updateData: ArticleUpdate) {
    return await articleDb.transaction(async (tx) => {
      const [article] = await tx
        .select({ id: articles.articleId })
        .from(articles)
        .where(eq(articles.slug, slug));

      if (!article) {
        tx.rollback();
        return null;
      }

      const articleId = article.id;
      
      if (updateData.article) {
        await tx
          .update(articles)
          .set({
            ...updateData.article,
            updatedAt: new Date(),
          })
          .where(eq(articles.articleId, articleId));
      }

      if (updateData.authorIds && updateData.authorIds.length > 0) {
        await tx
          .delete(articleAuthors)
          .where(eq(articleAuthors.articleId, articleId));
        
        const authorRows = updateData.authorIds.map((authorId) => ({
          articleId, 
          authorId,
        }));

        await tx.insert(articleAuthors).values(authorRows);
      }
      
      const [updatedArticle] = await tx
        .select()
        .from(articles)
        .where(eq(articles.articleId, articleId));
      
      return updatedArticle;
    });
  }

  async findArticleBase(slug: string) {
    const [articleBase] = await articleDb
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
      .where(eq(articles.slug, slug));
    
    return articleBase;
  }

  async findAuthorIdsByArticleId(articleId: string) {
    return await articleDb
      .select({
        articleId: articleAuthors.articleId,
        authorId: articleAuthors.authorId
      })
      .from(articleAuthors)
      .where(eq(articleAuthors.articleId, articleId));
  }

  async softDeleteArticle(slug: string) {
    const [deletedArticle] = await articleDb
      .update(articles)
      .set({
        isLive: false,
        status: "archived",
      })
      .where(eq(articles.slug, slug))
      .returning({ 
        articleId: articles.articleId,
        slug: articles.slug,
        isLive: articles.isLive,
        status: articles.status,
      });
    
    return deletedArticle;
  }

  // for development
  async deleteAllArticles() {
    await articleDb.delete(articles);
  }
}
