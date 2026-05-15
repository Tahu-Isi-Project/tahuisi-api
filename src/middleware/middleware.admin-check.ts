import { UnauthorizedError } from "@common/common.http-error";
import { Context, Next } from "hono";

export const adminCheckMiddleware = async (c: Context, next: Next) => {
  const role = c.get("user").role;
  if (role !== "admin") throw new UnauthorizedError();
  
  await next();
};
