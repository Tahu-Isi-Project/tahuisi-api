import { COOKIE_SECRET } from "@common/common.constants";
import { UnauthorizedError } from "@common/common.error";
import { authService } from "@common/common.singleton";
import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";

export const authMiddleware = async (c: Context, next: Next) => {
  const sessionId = await getSignedCookie(c, COOKIE_SECRET, "session_id");
  if (!sessionId) throw new UnauthorizedError();

  const session = await authService.getSession(sessionId);
  if (!session) throw new UnauthorizedError();
  
  c.set("userId", session.userId);
  c.set("sessionId", sessionId);
  await next();
};
