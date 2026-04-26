import ArticleRepository from "@article/article.repository";
import { NotFoundError } from "@common/common.error";
import MediaService from "@media/media.service";
import { MediaColumn } from "@media/media.types";
import { ArticleInsert, Headline } from "@article/article.types";

export default class ArticleService {
  private repo: ArticleRepository;
  private mediaService: MediaService;

  constructor(articleRepository: ArticleRepository, mediaService: MediaService) {
    this.repo = articleRepository;
    this.mediaService = mediaService;
  }

  async getHeadlines(limit: number): Promise<Headline[]> {
    const headlineBaseList = await this.repo.findLatestHeadlinesBase(limit);

    if (headlineBaseList.length === 0)
      throw new NotFoundError("No headlines found.");

    const thumbnailIdList = headlineBaseList.flatMap((base) =>
      base.thumbnailId !== null ? [base.thumbnailId] : []
    );

    const mediaQuery = ["altText", "r2Key"] as MediaColumn[];
    const mediaList = await this.mediaService.queryByIds(mediaQuery, thumbnailIdList);

    const mediaMap = new Map(mediaList.map((media) => [media.id, media]));

    return headlineBaseList.map((base) => {
      const media = base.thumbnailId ? mediaMap.get(base.thumbnailId) : null;
      return {
        slug: base.slug,
        title: base.title,
        excerpt: base.excerpt,
        thumbnailSrc: media ? media.r2Key : null,
        thumbnailAlt: media ? media.altText : null,
      };
    });
  }

  async createArticle(article: ArticleInsert) {
    try {
      await this.repo.createArticle(article);
    } catch (error) {
      console.error(error);
    }
  }
  
}
