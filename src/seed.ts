import { UserRegister } from "@auth/auth.types";
import { users } from "@auth/db/schema";
import { authDb } from "@auth/index";
import { authService } from "@common/common.singleton";

export async function seedDatabases() {
  await seedAuthDatabase();
}

async function seedAuthDatabase() {
  const [authSample] = await authDb
    .select({ userId: users.userId })
    .from(users)
    .limit(1);

  if (authSample) return;

  const jokoUser = {
    email: "joko@email.com",
    password: "passwordkuat",
    username: "joko",
    gender: "male",
    displayName: "joko is there",
    role: "user",
  } as UserRegister;

  const ryhunUser = {
    email: "ryhun@emailkeren.com",
    password: "inipassword",
    username: "ryhun",
    gender: "male",
    displayName: "ryhun was here",
    role: "admin",
  } as UserRegister;

  console.log("Seeding auth database...");
  const [jokoUserId, ryhunUserId] = await Promise.all([
    await authService.registerUser(jokoUser),
    await authService.registerUser(ryhunUser),
  ]);

  console.log("Auth database seeded!");
  console.log({ jokoUserId, ...jokoUser }, { ryhunUserId, ...ryhunUser });
}