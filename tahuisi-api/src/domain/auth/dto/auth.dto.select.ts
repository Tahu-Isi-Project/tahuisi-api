import { userEntitySchema } from "@auth/auth.entity";
import z from "zod";

export const userLoginDto = userEntitySchema
  .pick({
    userId: true,
    email: true,
  })
  .extend({
    password: z.string()
  });
