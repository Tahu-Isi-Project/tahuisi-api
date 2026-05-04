import { 
  sqliteTable, 
  text, 
  integer, 
  index, 
  primaryKey, 
  check 
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

//==============================================================================
//                                Articles Table
//==============================================================================

export const articles = sqliteTable("articles", {
  articleId: text("article_id").primaryKey(), 
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  status: text("status", { enum: ["draft", "pending_review", "published", "archived"] })
    .notNull()
    .default("draft"),
  thumbnailId: text("thumbnail_id"), 
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  isLive: integer("is_live", { mode: "boolean" }).notNull().default(false)
}, (t) => [
  index("status_date_idx").on(t.status, t.publishedAt),
  check("check_live_status", 
    sql`${t.isLive} = 0 OR (${t.isLive} = 1 AND ${t.status} = 'published')`
  ),
  check("check_publish_date", 
    sql`${t.publishedAt} IS NULL OR ${t.createdAt} <= ${t.publishedAt}`
  ),
  check("check_update_created",
    sql`${t.updatedAt} IS NULL OR ${t.updatedAt} >= ${t.createdAt}`
  ),
  check("check_update_published", 
    sql`${t.updatedAt} IS NULL OR ${t.publishedAt} IS NULL OR ${t.updatedAt} >= ${t.publishedAt}`
  )
]);

//==============================================================================
//                            Article Authors Table
//==============================================================================

export const articleAuthors = sqliteTable("article_authors", {
  articleId: text("article_id")
    .notNull()
    .references(() => articles.articleId, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
}, (table) => [
  primaryKey({ columns: [table.articleId, table.authorId] }),
  index("author_id_idx").on(table.authorId)
]);

//==============================================================================
//                                Relations
//==============================================================================

export const articlesRelations = relations(articles, ({ many }) => ({
  articleAuthors: many(articleAuthors),
}));

export const articleAuthorsRelations = relations(articleAuthors, ({ one }) => ({
  article: one(articles, {
    fields: [articleAuthors.articleId],
    references: [articles.articleId],
  }),
}));