import { media } from "@media/db/schema";
import { getTableColumns, inArray } from "drizzle-orm";
import { MediaColumn } from "@media/media.types";
import { mediaDb } from "@media/index";

export default class MediaRepository {
  private mediaColumns = getTableColumns(media);

  async findFilesByIds(columns: MediaColumn[], ids: string[]) {
    const selectedColumns = Object.fromEntries(
      ["id", ...columns].map(
        (col) => [col, this.mediaColumns[col as MediaColumn]]
      ),
    ) as typeof this.mediaColumns;

    return await mediaDb
      .select(selectedColumns)
      .from(media)
      .where(inArray(media.id, ids));
  }
}
