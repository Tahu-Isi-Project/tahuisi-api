import { Hono } from "hono";
import { validateArticleInsertBody, validateArticleUpdateBody, validateLimitQuery, validateSlugParam } from "@article/article.validator";
import { articleService } from "@common/common.singleton";
import { internalAuthMiddleware } from "@middleware/middleware.internal-auth";

const article = new Hono();

article.use("*", internalAuthMiddleware);

article.get("/", validateLimitQuery, async (c) => {
  const { limit } = c.req.valid("query");
  const headlines = await articleService.getHeadlines(limit);

  return c.json(headlines);
});

article.post("/", validateArticleInsertBody, async (c) => {
  const body = c.req.valid("json");
  await articleService.createArticle(body);

  return c.json({ message: "Article created" }, 201);
});

article.get("/:slug", validateSlugParam, async (c) => {
  const { slug } = c.req.valid("param");
  const article = await articleService.getArticle(slug);

  return c.json(article);
});

article.patch("/:slug", validateSlugParam, validateArticleUpdateBody, async (c) => {
  const { slug } = c.req.valid("param");
  const articleUpdateBody = c.req.valid("json");
  const updatedArticle = await articleService.updateArticle(slug, articleUpdateBody);

  return c.json({ message: "Article updated", article: updatedArticle }, 201);
});

// article.delete("/:slug", validateSlugParam, async (c) => {
//   const { slug } = c.req.valid("param");
//   const deletedSlug = await articleService.deleteArticle(slug);

//   return c.json({ message: "Deleted", slug: deletedSlug });
// });

// for development
article.delete("/delete-all", async (c) => {
  await articleService.deleteAllArticles();
  return c.json({ message: "Articles gone, reduced to atoms" }, 200);
});

export default article;
