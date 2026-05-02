import { UnauthorizedError } from "@common/common.http-error";
import { Context, Next } from "hono";

const internalSecret = Bun.env.INTERNAL_SECRET;

if (!internalSecret) throw new Error("INTERNAL_SECRET is undefined");

export const internalAuthMiddleware = async (c: Context, next: Next) => {
  const incomingSecret = c.req.header("x-internal-secret");
  if (incomingSecret !== internalSecret) throw new UnauthorizedError();
  
  await next();
};