import { createDomainDb } from "@common/common.db-factory";

export const { db: mediaDb, runMigrations: runMediaMigrations } = createDomainDb("media");