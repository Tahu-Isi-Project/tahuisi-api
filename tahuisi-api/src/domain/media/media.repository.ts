import { mediaDb } from "@media/db/media.db.client";
import { media } from "@media/db/media.db.schema";
import { getTableColumns, inArray } from "drizzle-orm";
import { MediaColumn } from "@media/media.types";

export default class MediaRepository {
  private mediaColumns = getTableColumns(media);

  async queryByIds(columns: MediaColumn[], ids: string[]) {
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
