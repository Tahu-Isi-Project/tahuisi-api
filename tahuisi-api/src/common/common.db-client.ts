import { Client, createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export default function createDbClient(dbPath: string, schema: any) {
  const client: Client = createClient({ url: `file:${dbPath}` });
  return drizzle(client, { schema });
}
