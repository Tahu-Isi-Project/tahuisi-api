import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

export default function createDbClient(dbPath: string, schema: any) {
  const cleanPath = dbPath.startsWith("file:") ? dbPath.replace("file:", "") : dbPath;
  const sqlite = new Database(cleanPath);
  return drizzle(sqlite, { schema });
}
