import { customValidator } from "@common/common.validator";
import { userRegisterDto } from "@auth/dto/auth.dto.insert";

export const validateUserRegisterBody = customValidator("json", userRegisterDto);