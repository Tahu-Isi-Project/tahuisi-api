import { customValidator } from "@common/common.validator";
import { mediaFormInsertDto } from "@media/dto/media.dto.insert";
import z from "zod";

export const validateMediaUploadForm = customValidator("form", mediaFormInsertDto);

export const validateMediaDataIdsQuery = customValidator("query", z.object({
  ids: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .pipe(z.array(z.string()).min(1).max(30)),
  columns: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .pipe(z.array(z.string()).min(1).max(30))
    .optional(),
}));