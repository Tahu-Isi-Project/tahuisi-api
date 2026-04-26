import { mediaTypeEnum, Metadata, mimeTypeEnum } from "@media/media.model";
import { randomUUIDv7 } from "bun";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const media = sqliteTable("media", {
  id: text("id", { mode: "text" })
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  uploaderId: text("uploader_id").notNull(),
  mediaType: text("media_type", { enum: mediaTypeEnum }).notNull(),
  mimeType: text("mime_type", { enum: mimeTypeEnum }).notNull(),
  altText: text("alt_text", { mode: "text" }),
  r2Key: text("r2_key", { mode: "text" }).unique().notNull(),
  fileName: text("file_name", { mode: "text" }).notNull(),
  fileSize: integer("file_size", { mode: "number" }).notNull(),
  metadata: text("metadata", { mode: "json" })
    .$type<Metadata>()
    .default({}),
  isPublic: integer("is_public", { mode: "boolean" })
    .default(true),
  uploadedAt: integer("uploaded_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
}, (table) => [
  index("idx_media_uploader").on(table.uploaderId),
  index("idx_media_type").on(table.mediaType)
]);
