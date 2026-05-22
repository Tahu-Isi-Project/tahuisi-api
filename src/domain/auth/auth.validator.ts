import { customValidator } from "@common/common.validator";
import { userRegisterDto } from "@auth/dto/auth.dto.insert";
import { userLoginBaseDto } from "@auth/dto/auth.dto.select";
import z from "zod";

export const validateUserRegisterBody = customValidator("json", userRegisterDto);

export const validateUserLoginBody = customValidator("json", userLoginBaseDto);

export const validateUserSearchQuery = customValidator("query", 
  z.object({
    usernames: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .pipe(z.array(z.string()).min(1).max(20))
  })
);