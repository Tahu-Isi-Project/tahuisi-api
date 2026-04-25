import z from "zod";
import { EnumValues } from "zod/v3";

export const mimeTypeEnum: EnumValues = [
  "image/apng",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",

  "audio/mpeg",
  "audio/vorbis",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/aac",

  "video/mp4",
  "video/webm",
  "video/mpeg",

  "application/ogg",
  "application/json",
  "application/pdf",
  "application/zip",
];

export const mediaTypeEnum: EnumValues = [
  "IMAGE",
  "AUDIO",
  "VIDEO",
  "DOCUMENT",
];

const metadataSchema = z
  .object({
    width: z.int(),
    height: z.int(),
    blurhash: z.string(),
    duration: z.int(),
    bitrate: z.int(),
    pages: z.int(),
  })
  .partial();

export type Metadata = z.infer<typeof metadataSchema>;

export const mediaSchema = z.object({
  id: z.uuidv7(),
  uploaderId: z.uuidv7(),
  mediaType: z.enum(mediaTypeEnum),
  mimeType: z.enum(mimeTypeEnum),
  altText: z.string().nullable(),
  r2Key: z.string(),
  fileName: z.string().min(2),
  fileSize: z.int(),
  metadata: z.object(metadataSchema.shape).nullable(),
  isPublic: z.boolean().default(true),
  uploadedAt: z.date().default(new Date()),
});

export type Media = z.infer<typeof mediaSchema>;
