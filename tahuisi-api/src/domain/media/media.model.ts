import z from "zod";
import { EnumValues } from "zod/v3";

export const mediaTypeEnum: EnumValues = [
  "image",
  "audio",
  "video",
  "document",
];

export const extraMetadataSchema = z
  .object({
    duration: z.number().optional(),
    bitrate: z.number().optional(),
    pages: z.number().optional()
  });

export const mediaSchema = z.object({
  id: z.uuidv7(),
  uploaderId: z.uuidv7(),
  mediaType: z.enum(mediaTypeEnum),
  mimeType: z.string().min(1),
  extraMetadata: extraMetadataSchema.nullable(),
  altText: z.string().nullable(),
  r2Key: z.string(),
  fileName: z.string().min(2),
  fileSize: z.int(),
  isPublic: z.boolean().default(true),
  uploadedAt: z.date().default(new Date()),
});
