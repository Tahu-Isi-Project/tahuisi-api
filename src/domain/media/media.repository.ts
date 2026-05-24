import { media } from "@media/db/schema";
import { and, eq, getTableColumns, inArray, lt, ne } from "drizzle-orm";
import { MediaColumn, MediaInsert } from "@media/media.types";
import { mediaDb } from "@media/index";
import { randomUUIDv7 } from "bun";

export default class MediaRepository {
  private mediaColumns = getTableColumns(media);

  async findByIdsFromQueries(ids: string[], columns: MediaColumn[]) {
    const selectedColumns = Object.fromEntries(
      columns.map((col) => [col, this.mediaColumns[col as MediaColumn]]),
    ) as typeof this.mediaColumns;

    return await mediaDb
      .select(selectedColumns)
      .from(media)
      .where(inArray(media.id, ids));
  }

  async save(data: MediaInsert) {
    const date = new Date();

    const [res] = await mediaDb
      .insert(media)
      .values({
        id: randomUUIDv7(),
        uploadedAt: date,
        updatedAt: date,
        ...data,
      })
      .onConflictDoUpdate({
        target: [media.fileHash],
        set: {
          updatedAt: date,
        },
      })
      .returning({
        id: media.id,
        status: media.status,
      });

    return res;
  }

  async updateStatus(key: string, status: "ready" | "pending" | "deleting") {
    const [res] = await mediaDb
      .update(media)
      .set({ status })
      .where(eq(media.key, key))
      .returning({
        id: media.id,
        status: media.status,
      });

    return res;
  }

  async deleteByKey(key: string) {
    const [deleted] = await mediaDb
      .delete(media)
      .where(eq(media.key, key))
      .returning({ 
        id: media.id,
        key: media.key,
      })
      
    return deleted;
  }

  async getAllMediaData() {
    return await mediaDb.select().from(media);
  }

  async deleteAll() {
    await mediaDb.delete(media);
  }

  async deleteByKeys(keys: string[]) {
    await mediaDb.delete(media).where(inArray(media.key, keys));
  }

  async findDanglingKeys() {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);

    const items = await mediaDb
      .select({ key: media.key })
      .from(media)
      .where(and(ne(media.status, "ready"), lt(media.uploadedAt, oneHourAgo)));

    return items.map((item) => item.key);
  }
}
