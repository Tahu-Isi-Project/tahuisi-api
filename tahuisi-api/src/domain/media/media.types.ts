import { media } from "@media/db/schema";

export type MediaColumn = keyof typeof media.$inferSelect;
