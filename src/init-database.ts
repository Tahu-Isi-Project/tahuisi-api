import { runArticleMigrations } from "@article/index";
import { runAuthMigrations } from "@auth/index";
import { runMediaMigrations } from "@media/index";

export async function initDatabases() {
  console.log("Starting database migrations...");

  await Promise.all([
    runAuthMigrations(),
    runArticleMigrations(),
    runMediaMigrations(),
  ]);

  console.log("All databases are up to date.");
}
