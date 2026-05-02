import { NotFoundError } from "@common/common.http-error";

export class ArticleNotFoundError extends NotFoundError {
  constructor(slug: string) {
    super(`Article does not exist: ${slug}`);
  }
}