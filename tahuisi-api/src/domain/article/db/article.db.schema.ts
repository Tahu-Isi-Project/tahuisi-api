import { 
  sqliteTable, 
  text, 
  integer, 
  index, 
  primaryKey, 
  check 
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { uuidv7 } from "uuidv7";

//==============================================================================
//                                Articles Table
//==============================================================================

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()), 
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"] })
    .notNull()
    .default("DRAFT"),
  thumbnailId: text("thumbnail_id"), 
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
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
    .references(() => articles.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull()
}, (table) => [
  primaryKey({ columns: [table.articleId, table.authorId] }),
  index("author_id_idx").on(table.authorId)
]);

//==============================================================================
//                                Relations
//==============================================================================

export const articlesRelations = relations(articles, ({ many }) => ({
  authors: many(articleAuthors),
}));

export const articleAuthorsRelations = relations(articleAuthors, ({ one }) => ({
  article: one(articles, {
    fields: [articleAuthors.articleId],
    references: [articles.id],
  }),
}));