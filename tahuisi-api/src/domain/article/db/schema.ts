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
  status: text("status", { enum: ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"] })
    .notNull()
    .default("DRAFT"),
  thumbnailId: text("thumbnail_id"), 
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$onUpdate(() => new Date()),
  isLive: integer("is_live", { mode: "boolean" }).notNull().default(false)
}, (table) => [
  index("status_date_idx").on(table.status, table.publishedAt),
  check("live_status_check", 
    sql`NOT (${table.isLive} = 1 AND ${table.status} != 'PUBLISHED')`
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