// import z from "zod";
// import { zValidator } from "@hono/zod-validator";
// import { articleBaseSchema } from "@article/article.entity";
// import { ValidationTargets } from "hono";
// import { articleInsertDto } from "@article/article.dto";

// function customValidator<
//   T extends keyof ValidationTargets,
//   S extends z.ZodTypeAny
// >(target: T, schema: S) {
//   return zValidator(target, schema, (result, c) => {
//     if (!result.success)
//       return c.json({ status: "Bad request", error: result.error }, 400);
//   });
// }

// export const validateSlugParam = customValidator("param", articleBaseSchema.pick({ slug: true }));

// export const validateLimitQuery = customValidator("query",
//   z.object({
//     limit: z.coerce
//       .number({ message: "Limit must be a number or left undefined" })
//       .int({ message: "Limit must be a whole number" })
//       .min(1, { message: "Limit must be at least 1" })
//       .max(30, { message: "Limit cannot exceed 30" })
//       .default(10)
//   })
// );

// export const validateArticleInsertBody = customValidator("json", articleInsertDto);
