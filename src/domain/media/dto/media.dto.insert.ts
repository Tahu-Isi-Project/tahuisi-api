import { mediaEntitySchema } from "@media/media.entity";
import z from "zod";

const KB = 1_024;
const MB = KB * 1_024;

export const mediaFormInsertDto = mediaEntitySchema
  .pick({
    altText: true,
    isPublic: true,
    extraMetadata: true,
  })
  .extend({
    file: z.file().max(5 * MB),
  });

export const mediaInsertDto = mediaEntitySchema
  .pick({ 
    uploaderId: true,
    status: true,
    mediaType: true,
    mimeType: true,
    key: true,
    bucketName: true,
    fileName: true,
    fileSize: true,
    fileHash: true,
    width: true,
    height: true,
    thumbhash: true,
    extraMetadata: true,
    altText: true,
    isPublic: true
  });
