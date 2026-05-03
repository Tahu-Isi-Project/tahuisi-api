import { media } from "@media/db/schema";
import z from "zod";
import { extraMetadataSchema, mediaSchema } from "./media.model";

export type MediaColumn = keyof typeof media.$inferSelect;
export type ExtraMetadata = z.infer<typeof extraMetadataSchema>;
export type Media = z.infer<typeof mediaSchema>;