import * as schema from "@media/db/schema";
import createDbClient from "@common/common.db-client";

const dbPath = process.env.MEDIA_DB_FILE_PATH;
if (!dbPath)
  throw new Error("MEDIA_DB_FILE_PATH is undefined.");

export const mediaDb = createDbClient(dbPath, schema);
