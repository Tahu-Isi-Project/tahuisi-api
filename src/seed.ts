import { UserRegister } from "@auth/auth.types";
import { authService } from "@common/common.singleton";

export async function seedAuthDatabase() {
  console.log("Deleting all registered users...")
  await authService.deleteAllSessions();
  await authService.deleteAllUsers();

  const jokoUser = {
    email: "joko@email.com",
    password: "passwordkuat",
    username: "joko",
    gender: "male",
    displayName: "joko is there",
  } as UserRegister;

  const ryhunUser = {
    email: "ryhun@emailkeren.com",
    password: "inipassword",
    username: "ryhun",
    gender: "male",
    displayName: "ryhun was here",
  } as UserRegister;

  console.log("Seeding auth database...");
  const [jokoUserId, ryhunUserId] = await Promise.all([
    await authService.registerUser(jokoUser),
    await authService.registerUser(ryhunUser),
  ]);

  console.log("Auth database seeded!");
  console.log({ jokoUserId, ...jokoUser }, { ryhunUserId, ...ryhunUser });
}