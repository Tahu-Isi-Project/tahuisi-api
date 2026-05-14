import { COOKIE_SECRET } from "@common/common.constants";
import { UnauthorizedError } from "@common/common.http-error";
import { authService } from "@common/common.singleton";
import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";

export const userAuthMiddleware = (async (c: Context, next: Next) => {
  const sessionId = await getSignedCookie(c, COOKIE_SECRET, "session_id");
  
  if (!sessionId) throw new UnauthorizedError();

  const user = await authService.getUserAndSession(sessionId);

  if (!user) throw new UnauthorizedError();
  if (user.userStatus === "banned")
    throw new UnauthorizedError(`'${user.username}' is banned`);

  if (user.expiresAt < new Date()) {
    await authService.logoutUser(user.sessionId);
    throw new UnauthorizedError("Session expired");
  }

  const userData = {
    userId: user.userId,
    username: user.username,
    role: user.role,
  };

  c.set("user", userData);
  c.set("sessionId", user.sessionId);

  await next();
});