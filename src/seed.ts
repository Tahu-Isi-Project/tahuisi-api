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

  const JOKO_SHA256_PASSWORD = "92990e9c3ae0796b79aaa1c857fc1c986f815909a919ace380bfc0a1f059fe31"; // passwordkuat
  const RYHUN_SHA256_PASSWORD = "6b8b5b14be25345f0f29975a47447391571af2b266a8a2c76e5b07418b4f5c96";  // inipassword

  const jokoUser = {
    email: "joko@email.com",
    password: JOKO_SHA256_PASSWORD,
    username: "joko",
    gender: "male",
    displayName: "joko is there",
    role: "user",
  } as UserRegister;

  const ryhunUser = {
    email: "ryhun@emailkeren.com",
    password: RYHUN_SHA256_PASSWORD,
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