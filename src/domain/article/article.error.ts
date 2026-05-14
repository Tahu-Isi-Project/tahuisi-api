import { ConflictError, NotFoundError } from "@common/common.http-error";

export class ArticleNotFoundError extends NotFoundError {
  constructor(slug: string) {
    super(`Article does not exist: ${slug}`);
  }
}

export class ArticleConflictError extends ConflictError {
  constructor(slug: string) {
    super(`Article with slug '${slug}' already exists`);
  }
}