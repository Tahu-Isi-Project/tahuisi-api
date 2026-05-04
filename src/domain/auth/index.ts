import { createDomainDb } from "@common/common.db-factory";

export const { db: authDb, runMigrations: runAuthMigrations } = createDomainDb("auth");
