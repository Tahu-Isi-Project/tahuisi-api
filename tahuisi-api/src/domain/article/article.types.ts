import { headlineDto } from "@article/article.dto";
import z from "zod";

export type Headline = z.infer<typeof headlineDto>;