import * as schema from "@auth/db/auth.db.schema";
import createDbClient from "@common/common.db-client";

const dbPath = process.env.AUTH_DB_FILE_PATH;
if (!dbPath)
  throw new Error("AUTH_DB_FILE_PATH is undefined.");

export const authDb = createDbClient(dbPath, schema);
