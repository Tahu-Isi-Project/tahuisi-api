import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import path from "path";
import { existsSync } from "node:fs";

export function createDomainDb(domainName: string) {
  const root = process.cwd();

  const dbFile = Bun.env.DATABASE_BASE_PATH
    ? path.join(Bun.env.DATABASE_BASE_PATH, `${domainName}.db`)
    : path.join(root, `${domainName}.local.db`);

  const sqlite = (() => {
    try {
      const sqliteDb = new Database(dbFile);
      sqliteDb.run("PRAGMA journal_mode = WAL;");
      return sqliteDb;
    } catch (err: any) {
      if (err.code && err.code === "SQLITE_CANTOPEN") {
        console.error(`error: Unable to open database '${dbFile}' due to not exist or insufficient access permissions.`,);
        process.exit(1);
      }
      throw err;
    }
  })();

  const db = drizzle(sqlite);

  const runMigrations = async () => {
    const migrationsFolder = Bun.env.MIGRATIONS_BASE_PATH
      ? path.join(Bun.env.MIGRATIONS_BASE_PATH, domainName)
      : path.join(root, "migrations", domainName);

    console.log(`Migrating domain [${domainName}] from: ${migrationsFolder}`);

    if (!existsSync(migrationsFolder))
      throw new Error(`Migration folder not found: ${migrationsFolder}`);

    migrate(db, { migrationsFolder });
  };

  return { db, runMigrations };
}
