import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { NO_SPACE_REGEX } from "@common/common.regex";
import { media, mediaStatusEnum, mediaTypeEnum } from "@media/db/schema";

export const extraMetadataSchema = z.object({
  duration: z.int().positive().optional(),
  bitrate: z.int().positive().optional(),
  pages: z.int().positive().optional(),
});

export const mediaEntitySchema = createInsertSchema(media, {
  id: z.uuidv7(),
  uploaderId: z.uuidv7(),
  status: z.enum(mediaStatusEnum),

  mediaType: z.enum(mediaTypeEnum),
  mimeType: z.string().min(1),

  key: z.string().regex(NO_SPACE_REGEX),
  bucketName: z.string(),
  fileName: z.string(),
  fileSize: z.int().positive(),
  fileHash: z.hash("sha256"),

  width: z.int().positive().nullable(),
  height: z.int().positive().nullable(),
  thumbhash: z.base64().nullable(),

  extraMetadata: extraMetadataSchema.optional(),

  altText: z.string().nullable(),
  isPublic: z.coerce.boolean().default(true),

  uploadedAt: z.coerce.date().default(new Date()),
  updatedAt: z.coerce.date().default(new Date()),
});
