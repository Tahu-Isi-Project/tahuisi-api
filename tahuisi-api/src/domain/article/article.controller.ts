import { Hono } from "hono";
import ArticleService from "./article.service";
import { validateArticleInsertBody, validateLimitQuery, validateSlugParam } from "./article.validator";

type Variables = {
  articleService: ArticleService;
};

const app = new Hono<{ Variables: Variables }>();

// app.use("*", async (c, next) => {
//   const repo = new ArticleRepository(articleDb);
//   c.set("articleService", new ArticleService(repo, c.env));

//   await next();
// });

app.get("/headlines", validateLimitQuery, async (c) => {
  const { limit } = c.req.valid("query");
  const headlines = await c.get("articleService").getHeadlines(limit);

  return c.json(headlines);
});


//==============================================================================
//                                Article routes
//==============================================================================

// const article = app.basePath("/article");

// article.post("/", validateArticleInsertBody, async (c) => {
//   const body = c.req.valid("json");
//   const insertedArticle = await c.get("articleService").createArticle(body);

//   return c.json({ message: "Article created", article: insertedArticle }, 201);
// });

// article.get("/:slug", validateSlugParam, async (c) => {
//   const { slug } = c.req.valid("param");
//   const article = await c.get("articleService").getArticle(slug);

//   return c.json(article);
// });

// article.patch("/:slug", validateSlugParam, validateArticleInsertBody, async (c) => {
//   const { slug } = c.req.valid("param");
//   const articleUpdateBody = c.req.valid("json");
//   const updatedArticle = await c.get("articleService").updateArticle(slug, articleUpdateBody);

//   return c.json({ message: "Article updated", article: updatedArticle }, 201);
// });

// article.delete("/:slug", validateSlugParam, async (c) => {
//   const { slug } = c.req.valid("param");
//   const deletedSlug = await c.get("articleService").deleteArticle(slug);

//   return c.json({ message: "Deleted", slug: deletedSlug });
// });

export default app;
