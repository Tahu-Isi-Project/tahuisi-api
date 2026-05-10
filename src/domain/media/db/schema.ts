import { ExtraMetadata } from "@media/media.types";
import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const mediaTypeEnum = [
  "image",
  "audio",
  "video",
  "document",
] as [string, ...string[]];

export const mediaStatusEnum = [
  "ready", 
  "pending", 
  "deleting",
] as [string, ...string[]];

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  uploaderId: text("uploader_id").notNull(),
  status: text("status", { enum: mediaStatusEnum }).notNull(),
  
  mediaType: text("media_type", { enum: mediaTypeEnum }).notNull(),
  mimeType: text("mime_type").notNull(),

  key: text("key").unique().notNull(),
  bucketName: text("bucket_name").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileHash: text("file_hash").unique().notNull(),

  width: integer("width"),
  height: integer("height"),
  thumbhash: text("thumbhash"),

  extraMetadata: text("extra_metadata", { mode: "json" }).$type<ExtraMetadata>(),

  altText: text("alt_text", { mode: "text" }),
  isPublic: integer("is_public", { mode: "boolean" }).notNull(),
  
  uploadedAt: integer("uploaded_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (t) => [
  index("idx_media_uploader").on(t.uploaderId),
  index("idx_media_type_dims").on(t.mediaType, t.width, t.height), // for filtering images by size
  index("idx_media_status").on(t.status),
  check("check_update_date", sql`${t.updatedAt} >= ${t.uploadedAt}`),
]);