import ArticleRepository from "@article/article.repository";
import { NotFoundError, UnprocessableContentError } from "@common/common.http-error";
import MediaService from "@media/media.service";
import { MediaColumn } from "@media/media.types";
import { Article, ArticleInsert, ArticleStatus, ArticleUpdate, Headline } from "@article/article.types";
import { authService } from "@common/common.singleton";
import { UNIQUE_CONSTRAINT_ERROR } from "@common/common.constants";
import MediaUtils from "@media/media.utils";
import { ArticleConflictError, ArticleNotFoundError } from "@article/article.error";
import { purgeArticleCache } from "@article/article.utils";

export default class ArticleService {
  private repo: ArticleRepository;
  private mediaService: MediaService;
  private urlExpiry: number;

  constructor(articleRepository: ArticleRepository, mediaService: MediaService) {
    this.repo = articleRepository;
    this.mediaService = mediaService;
    this.urlExpiry = Bun.env.S3_PRESIGN_EXPIRY ? Number(Bun.env.S3_PRESIGN_EXPIRY) : 60;
  }

  private async getMediaList(mediaIds: string[]) {
    const mediaQuery = ["altText", "key", "thumbhash"] as MediaColumn[];
    return await this.mediaService.getFilesData(mediaIds, mediaQuery);
  }

  private async checkAuthorsExistence(authors: string[]) {
    const authorsList = await authService.getDisplayNames(authors);

    if (authorsList.length !== authors.length) {
      const foundIds = new Set(authorsList.map((a) => a.userId));
      const missingIds = authors.filter((id) => !foundIds.has(id));
      throw new UnprocessableContentError(
        `Provided authorIds do not exist: ${missingIds.join(", ")}`
      );
    }
  }

  async getHeadlines(limit: number, status: ArticleStatus): Promise<Headline[]> {
    const headlineBaseList = await this.repo.findLatestHeadlinesBase(limit, status);

    if (headlineBaseList.length === 0)
      throw new NotFoundError("No headlines found.");

    const thumbnailIdList = headlineBaseList.flatMap((base) =>
      base.thumbnailId !== null ? [base.thumbnailId] : []
    );

    const mediaList = await this.getMediaList(thumbnailIdList);

    const mediaMap = new Map(mediaList.map((media) => [media.id, media]));

    return headlineBaseList.map((base) => {
      const media = base.thumbnailId ? mediaMap.get(base.thumbnailId) : null;
      return {
        slug: base.slug,
        title: base.title,
        excerpt: base.excerpt,
        rawThumbnailSrc: media ? MediaUtils.getPresignedUrl(media.key, this.urlExpiry) : null,
        thumbnailAlt: media ? media.altText : null,
        thumbhash: media ? media.thumbhash : null
      };
    });
  }

  async createArticle(article: ArticleInsert) {
    await this.checkAuthorsExistence(article.authorIds);
    
    try {
      await this.repo.createArticle(article);
      await purgeArticleCache(article.article.slug);
    } catch (err: any) {
      if (err.code === UNIQUE_CONSTRAINT_ERROR && err.message.includes("articles.slug"))
        throw new ArticleConflictError(article.article.slug);

      throw err;
    }
  }

  async updateArticle(slug: string, articleUpdate: ArticleUpdate) {
    if (articleUpdate.authorIds)
      await this.checkAuthorsExistence(articleUpdate.authorIds);
    
    try {
      const updatedArticle = await this.repo.updateArticle(slug, articleUpdate);
      if (updatedArticle === null || !updatedArticle)
        throw new ArticleNotFoundError(slug);
      
      await purgeArticleCache(slug);
      
      return updatedArticle;

    } catch (err: any) {
      if (err.code === UNIQUE_CONSTRAINT_ERROR && err.message.includes("articles.slug"))
        throw new ArticleConflictError(slug);

      throw err;
    }
  }

  async getArticle(slug: string): Promise<Article> {
    const articleBase = await this.repo.findArticleBase(slug);

    if (!articleBase) throw new ArticleNotFoundError(slug);

    const mediaList = articleBase.thumbnailId 
      ? await this.getMediaList([articleBase.thumbnailId]) 
      : [];

    const authorsData = await this.repo.findAuthorIdsByArticleId(articleBase.articleId);
    const authorIds = authorsData.map((data) => data.authorId);

    const authorNamesRaw = await authService.getDisplayNames(authorIds);
    const authorNames = authorNamesRaw.map((data) => data.displayName);

    const rawThumbnailSrc = mediaList[0] ? MediaUtils.getPresignedUrl(mediaList[0].key, this.urlExpiry) : null;
    return {
      article: {
        slug: articleBase.slug,
        title: articleBase.title,
        excerpt: articleBase.excerpt,
        body: articleBase.body,
        publishedAt: articleBase.publishedAt,
        updatedAt: articleBase.updatedAt,
        rawThumbnailSrc,
        thumbnailAlt: mediaList[0] ? mediaList[0].altText : null,
        thumbhash: mediaList[0] ? mediaList[0].thumbhash : null
      },
      authorNames
    }
  }

  async getSlug(slug: string) {
    return await this.repo.findOneSlug(slug);
  }

  async deleteArticle(slug: string) {
    const deletedArticle = await this.repo.softDeleteArticle(slug);
    if (!deletedArticle) throw new ArticleNotFoundError(slug);

    await purgeArticleCache(slug);

    return deletedArticle;
  }
  
  // for development
  async deleteAllArticles() {
    await this.repo.deleteAllArticles();
  }
}
