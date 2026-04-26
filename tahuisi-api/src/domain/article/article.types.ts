import z from "zod";
import { headlineSelectDto } from "@article/dto/article.dto.select";
import { articleInsertDto } from "@article/dto/article.dto.insert";

export type Headline = z.infer<typeof headlineSelectDto>;
export type ArticleInsert = z.infer<typeof articleInsertDto>;
