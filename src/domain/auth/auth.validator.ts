import { customValidator } from "@common/common.validator";
import { userRegisterDto } from "@auth/dto/auth.dto.insert";
import { userLoginBaseDto } from "@auth/dto/auth.dto.select";

export const validateUserRegisterBody = customValidator("json", userRegisterDto);

export const validateUserLoginBody = customValidator("json", userLoginBaseDto);
