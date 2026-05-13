import { Hono } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import {
  validateUserLoginBody,
  validateUserRegisterBody,
} from "@auth/auth.validator";
import { UserLogin } from "@auth/auth.types";
import { getConnInfo } from "hono/bun";
import { userAuthMiddleware } from "@middleware/middleware.user-auth";
import { authService } from "@common/common.singleton";
import { AppEnv } from "@/types";
import { COOKIE_SECRET } from "@common/common.constants";
import { InternalServerError } from "@common/common.http-error";

const auth = new Hono<AppEnv>();

auth.post("/register", validateUserRegisterBody, async (c) => {
  const registerBody = c.req.valid("json");
  const registeredUser = await authService.registerUser(registerBody);

  if (!registeredUser)
    throw new InternalServerError("Internal error occurred during registration.");

  return c.json({ message: "Registration successful", id: registeredUser.id }, 200);
});

auth.post("/login", validateUserLoginBody, async (c) => {
  const userAgent = c.req.header("User-Agent") || "Unknown Browser";
  const ipAddress = getConnInfo(c).remote.address || "0.0.0.0";
  const loginBodyBase = c.req.valid("json");

  const loginData: UserLogin = {
    email: loginBodyBase.email,
    password: loginBodyBase.password,
    userAgent,
    ipAddress,
  };

  const sessionId = await authService.loginUser(loginData);

  await setSignedCookie(c, "session_id", sessionId, COOKIE_SECRET, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return c.json({ message: "Login successful" }, 200);
});

auth.post("/logout", userAuthMiddleware, async (c) => {
  const sessionId = c.get("sessionId");
  await authService.logoutUser(sessionId);
  deleteCookie(c, "session_id", { path: "/" });
  return c.json({ message: "Logout successful" }, 200);
});

auth.post("/logout-all", userAuthMiddleware, async (c) => {
  const userId = c.get("userId");
  await authService.logoutAllDevices(userId);
  deleteCookie(c, "session_id", { path: "/" });
  return c.json({ message: "Logged out from all devices" });
});

// for development
auth.get("/sessions", async (c) => {
  const sessions = await authService.getSessions();
  return c.json({ sessions }, 200);
});

auth.delete("/sessions", async (c) => {
  await authService.deleteAllSessions();
  return c.json({ message: "All sessions deleted." }, 200);
});

export default auth;
