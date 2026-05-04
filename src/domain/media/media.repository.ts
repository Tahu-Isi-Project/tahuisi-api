import { media } from "@media/db/schema";
import { eq, getTableColumns, inArray } from "drizzle-orm";
import { MediaColumn, MediaEntity } from "@media/media.types";
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

  async saveMediaData(data: MediaEntity) {
    await mediaDb
      .insert(media)
      .values(data);
  }

  async deleteMediaDataByKey(key: string) {
    await mediaDb
      .delete(media)
      .where(eq(media.key, key));
  }

  async getAllMediaData() {
    return await mediaDb
      .select()
      .from(media);
  }

  async deleteAll() {
    await mediaDb.delete(media);
  }
}
