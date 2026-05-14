import z from "zod";
import { articleEntitySchema, articleStatusEnum } from "@article/article.entity";
import { articleInsertDto, articleUpdateDto } from "@article/dto/article.dto.insert";
import { customValidator } from "@common/common.validator";

export const validateSlugParam = customValidator("param",
  articleEntitySchema.pick({ slug: true }),
);

export const validateLimitQuery = customValidator("query",
  z.object({
    limit: z.coerce
      .number({ message: "Limit must be a number or left undefined" })
      .int({ message: "Limit must be a whole number" })
      .min(1, { message: "Limit cannot be less than 1" })
      .max(10, { message: "Limit cannot exceed 10" })
      .default(10),
  }),
);

export const validateStatusQuery = customValidator("query",
  z.object({
    status: articleStatusEnum.default("published")
  }),
);

export const validateArticleInsertBody = customValidator("json", articleInsertDto);

export const validateArticleUpdateBody = customValidator("json", articleUpdateDto);
