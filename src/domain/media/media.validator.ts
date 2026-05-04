import { customValidator } from "@common/common.validator";
import { mediaFormInsertDto } from "@media/dto/media.dto.insert";

export const validateMediaUploadForm = customValidator("form", mediaFormInsertDto);
