import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono/types";
import z from "zod";

export function customValidator<
  T extends keyof ValidationTargets,
  S extends z.ZodTypeAny
>(target: T, schema: S) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success)
      return c.json({ status: "Bad request", error: result.error.issues }, 400);
  });
}