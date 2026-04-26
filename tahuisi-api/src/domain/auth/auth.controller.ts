import { Hono } from "hono";
import { validateUserRegisterBody } from "@auth/auth.validator";
import AuthService from "@auth/auth.service";
import AuthRepository from "@auth/auth.repository";

const authService = new AuthService(new AuthRepository());

const app = new Hono();

const auth = app.basePath("/auth")

auth.post("/register", validateUserRegisterBody, async (c) => {
  const body = c.req.valid("json");
  await authService.registerUser(body);
});
