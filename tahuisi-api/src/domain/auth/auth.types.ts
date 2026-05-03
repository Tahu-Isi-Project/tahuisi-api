import z from "zod";
import { userRegisterDto, userSanitizedRegisterDto } from "@auth/dto/auth.dto.insert";
import { userLoginBaseDto, userLoginDto } from "@auth/dto/auth.dto.select";
import { userSessionEntitySchema } from "@auth/auth.entity";

export type UserRegister = z.infer<typeof userRegisterDto>;
export type SanitizedUserRegister = z.infer<typeof userSanitizedRegisterDto>;
export type UserLoginBase = z.infer<typeof userLoginBaseDto>;
export type UserLogin = z.infer<typeof userLoginDto>
export type UserSession = z.infer<typeof userSessionEntitySchema>;
