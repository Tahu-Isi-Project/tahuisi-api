import { mediaEntitySchema } from "@media/media.entity";
import z from "zod";

const KB = 1_024;
const MB = KB * 1_024;

export const mediaFormInsertDto = mediaEntitySchema
  .pick({
    uploaderId: true,
    altText: true,
    isPublic: true,
  })
  .extend({
    file: z.file().max(5 * MB),
  });
