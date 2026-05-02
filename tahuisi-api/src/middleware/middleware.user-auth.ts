import { COOKIE_SECRET } from "@common/common.constants";
import { UnauthorizedError } from "@common/common.http-error";
import { authService } from "@common/common.singleton";
import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";

export const userAuthMiddleware = async (c: Context, next: Next) => {
  const sessionId = await getSignedCookie(c, COOKIE_SECRET, "session_id");
  const session = sessionId ? await authService.getSession(sessionId) : null;
  
  if (!session || !session.userId) throw new UnauthorizedError();

  c.set("userId", session.userId);
  c.set("sessionId", sessionId);

  await next();
};
