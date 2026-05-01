import ArticleRepository from "@article/article.repository";
import ArticleService from "@article/article.service";
import AuthRepository from "@auth/auth.repository";
import AuthService from "@auth/auth.service";
import MediaRepository from "@media/media.repository";
import MediaService from "@media/media.service";

// Media
export const mediaService = new MediaService(new MediaRepository());

// Article
export const articleService = new ArticleService(new ArticleRepository(), mediaService);

// Auth
export const authService = new AuthService(new AuthRepository());
