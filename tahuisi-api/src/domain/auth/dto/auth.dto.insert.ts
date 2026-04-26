import { userEntitySchema } from "@auth/auth.entity";
import z from "zod";

export const userRegisterDto = userEntitySchema
  .pick({
    email: true,
    username: true,
    gender: true,
    displayName: true,
  })
  .extend({
    password: z.string()
  });

export const userSanitizedRegisterDto = userEntitySchema
  .pick({
    email: true,
    username: true,
    passwordHash: true,
    gender: true,
    displayName: true,
  })