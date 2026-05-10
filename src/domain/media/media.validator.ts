import { customValidator } from "@common/common.validator";
import { mediaFormInsertDto } from "@media/dto/media.dto.insert";
import z from "zod";

export const validateMediaUploadForm = customValidator("form", mediaFormInsertDto);

export const validateMediaDataIdsQuery = customValidator("query", z.object({
  ids: z
    .string()
    .transform((val) => val.split(","))
    .pipe(z.array(z.uuidv7()).min(1)),
  columns: z
    .string()
    .transform((val) => val.split(","))
    .optional(),
}));