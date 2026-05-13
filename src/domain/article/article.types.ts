import z from "zod";
import { articleSelectDto, headlineSelectDto } from "@article/dto/article.dto.select";
import { articleInsertDto, articleUpdateDto } from "@article/dto/article.dto.insert";

export type Headline = z.infer<typeof headlineSelectDto>;
export type ArticleInsert = z.infer<typeof articleInsertDto>;
export type ArticleUpdate = z.infer<typeof articleUpdateDto>
export type Article = z.infer<typeof articleSelectDto>;
