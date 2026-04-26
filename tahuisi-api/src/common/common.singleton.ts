import ArticleRepository from "@article/article.repository";
import ArticleService from "@article/article.service";
import MediaRepository from "@media/media.repository";
import MediaService from "@media/media.service";

// Media
export const mediaService = new MediaService(new MediaRepository());

// Article
export const articleService = new ArticleService(new ArticleRepository(), mediaService);
