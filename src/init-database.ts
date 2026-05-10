import { runArticleMigrations } from "@article/index";
import { runAuthMigrations } from "@auth/index";
import { runMediaMigrations } from "@media/index";
import { seedAuthDatabase } from "@/seed";

export async function initDatabases() {
  console.log("Starting database migrations...");

  await Promise.all([
    runAuthMigrations(),
    runArticleMigrations(),
    runMediaMigrations(),
  ]);

  console.log("All databases are up to date.");

  if (Bun.env.NODE_ENV == "development") {
    console.log("Running database seed scripts...");
    await seedAuthDatabase();
  }
}
