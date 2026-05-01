import { Hono } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import {
  validateUserLoginBody,
  validateUserRegisterBody,
} from "@auth/auth.validator";
import { UserLogin } from "@auth/auth.types";
import { getConnInfo } from "hono/bun";
import { authMiddleware } from "@middleware/middleware.auth";
import { authService } from "@common/common.singleton";
import { AppEnv } from "@/types";
import { COOKIE_SECRET } from "@common/common.constants";

const auth = new Hono<AppEnv>();

auth.post("/register", validateUserRegisterBody, async (c) => {
  const registerBody = c.req.valid("json");
  await authService.registerUser(registerBody);

  return c.json({ message: "Registration successful" }, 200);
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

auth.post("/logout", authMiddleware, async (c) => {
  const sessionId = c.get("sessionId");

  await authService.logoutUser(sessionId);

  deleteCookie(c, "session_id", { path: "/" });
  return c.json({ message: "Logout successful" }, 200);
});

auth.post("/logout-all", authMiddleware, async (c) => {
  const userId = c.get("userId");

  await authService.logoutAllDevices(userId);

  deleteCookie(c, "session_id", { path: "/" });

  return c.json({ message: "Logged out from all devices" });
});

export default auth;
