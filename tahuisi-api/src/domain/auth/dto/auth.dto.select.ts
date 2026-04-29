import { userEntitySchema } from "@auth/auth.entity";
import z from "zod";

export const userLoginBaseDto = userEntitySchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string(),
  });

export const userLoginDto = userLoginBaseDto.extend({
  userAgent: z.string(),
  ipAddress: z.string(),
});
