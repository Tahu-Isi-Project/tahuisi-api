import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/domain/auth/db/auth.db.schema.ts",
  out: "./src/domain/auth/db/migrations",
  dbCredentials: {
    url: "./data/auth.db",
  },
});
