import * as schema from "@article/db/article.db.schema";
import createDbClient from "@common/common.db-client";

const dbPath = process.env.ARTICLE_DB_FILE_PATH;
if (!dbPath)
  throw new Error("ARTICLE_DB_FILE_PATH is undefined.");

export const articleDb = createDbClient(dbPath, schema);
