import { createDomainDb } from "@common/common.db-factory";

export const { db: articleDb, runMigrations: runArticleMigrations } = createDomainDb("article");