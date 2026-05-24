import { customValidator } from "@common/common.validator";
import { mediaFormInsertDto } from "@media/dto/media.dto.insert";
import { media } from "@media/db/schema";
import z from "zod";

export const validateMediaUploadForm = customValidator("form", mediaFormInsertDto);

export const validateMediaQuery = customValidator("query", z.object({
  id: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .pipe(z.array(z.uuidv7()).min(1).max(30)),
  column: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .pipe(z.array(z.enum(Object.keys(media))).min(1))
    .optional()
    .default(["id"]),
  withUrl: z
    .string()
    .transform((val) => val.toLowerCase() === "true")
    .optional()
    .default(false)
}));