import { runArticleMigrations } from "@article/index";
import { runAuthMigrations } from "@auth/index";
import { runMediaMigrations } from "@media/index";

export async function initDatabases() {
  console.log("Starting database migrations...");
  
  await runAuthMigrations();
  await runArticleMigrations();
  await runMediaMigrations();
  // there will be multiple migration calls here later
  
  console.log("All databases are up to date.");
};