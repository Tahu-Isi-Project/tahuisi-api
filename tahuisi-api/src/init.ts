import { runAuthMigrations } from "@auth/index";

export async function initDatabases() {
  console.log("Starting database migrations...");
  
  await runAuthMigrations();
  // there will be multiple migration calls here later
  
  console.log("All databases are up to date.");
};