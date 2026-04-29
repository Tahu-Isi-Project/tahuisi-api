import { Hono } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import {
  validateUserLoginBody,
  validateUserRegisterBody,
} from "@auth/auth.validator";
import AuthService from "@auth/auth.service";
import AuthRepository from "@auth/auth.repository";
import { UserLogin } from "@auth/auth.types";
import { UnauthorizedError } from "@common/common.error";
import { getConnInfo } from "hono/bun";

if (!Bun.env.COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET is undefined.");
}

const cookieSecret = Bun.env.COOKIE_SECRET;

const authService = new AuthService(new AuthRepository());

const auth = new Hono();

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

  await setSignedCookie(c, "session_id", sessionId, cookieSecret, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return c.json({ message: "Login successful" }, 200);
});

auth.post("/logout", async (c) => {
  const sessionId = await getSignedCookie(c, cookieSecret, "session_id");
  if (!sessionId) throw new UnauthorizedError("Unauthorized");

  await authService.logoutUser(sessionId);

  return c.json({ message: "Logout successful" }, 200);
});

// for development
// auth.get("/sessions", async (c) => {
//   const sessions = await authService.getSessions();
//   return c.json({ sessions }, 200);
// });

// auth.delete("/sessions", async (c) => {
//   await authService.deleteAllSessions();
//   return c.json({ message: "All sessions deleted." }, 200);
// });

export default auth;
