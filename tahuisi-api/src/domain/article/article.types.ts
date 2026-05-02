import z from "zod";
import { articleSelectDto, headlineSelectDto } from "@article/dto/article.dto.select";
import { articleInsertDto } from "@article/dto/article.dto.insert";

export type Headline = z.infer<typeof headlineSelectDto>;
export type ArticleInsert = z.infer<typeof articleInsertDto>;
export type Article = z.infer<typeof articleSelectDto>;
