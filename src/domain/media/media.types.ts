import { media } from "@media/db/schema";
import z from "zod";
import { extraMetadataSchema, mediaEntitySchema } from "@media/media.entity";
import { mediaFormInsertDto, mediaInsertDto } from "@media/dto/media.dto.insert";

export type MediaColumn = keyof typeof media.$inferSelect;
export type ExtraMetadata = z.infer<typeof extraMetadataSchema>;
export type MediaForm = z.infer<typeof mediaFormInsertDto>;
export type MediaEntity = z.infer<typeof mediaEntitySchema>;
export type MediaInsert = z.infer<typeof mediaInsertDto>;