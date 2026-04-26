import { Hono } from "hono";
import { validateArticleInsertBody, validateLimitQuery } from "@article/article.validator";
import { articleService } from "@common/common.singleton";

const app = new Hono();

app.basePath("/article");

app.get("/headlines", validateLimitQuery, async (c) => {
  const { limit } = c.req.valid("query");
  const headlines = await articleService.getHeadlines(limit);

  return c.json(headlines);
});


const article = app.basePath("/post");

article.post("/", validateArticleInsertBody, async (c) => {
  const body = c.req.valid("json");
  const insertedArticle = await articleService.createArticle(body);

  return c.json({ message: "Article created", article: insertedArticle }, 201);
});

// article.get("/:slug", validateSlugParam, async (c) => {
//   const { slug } = c.req.valid("param");
//   const article = await articleService.getArticle(slug);

//   return c.json(article);
// });

// article.patch("/:slug", validateSlugParam, validateArticleInsertBody, async (c) => {
//   const { slug } = c.req.valid("param");
//   const articleUpdateBody = c.req.valid("json");
//   const updatedArticle = await articleService.updateArticle(slug, articleUpdateBody);

//   return c.json({ message: "Article updated", article: updatedArticle }, 201);
// });

// article.delete("/:slug", validateSlugParam, async (c) => {
//   const { slug } = c.req.valid("param");
//   const deletedSlug = await articleService.deleteArticle(slug);

//   return c.json({ message: "Deleted", slug: deletedSlug });
// });

export default app;
