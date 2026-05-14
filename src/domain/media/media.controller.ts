import { Hono } from "hono";
import { validateMediaDataIdsQuery, validateMediaUploadForm } from "@media/media.validator";
import { mediaService } from "@common/common.singleton";
import { userAuthMiddleware } from "@middleware/middleware.user-auth";
import { AppEnv } from "@/types";
import { MediaColumn } from "./media.types";

const media = new Hono<AppEnv>();

media.put("/", userAuthMiddleware, validateMediaUploadForm, async (c) => {
  const uploadForm = c.req.valid("form");
  const uploaderId = c.get("userId");
  const fileData = await mediaService.saveFile(uploadForm, uploaderId);

  return c.json({ message: "File uploaded", file: fileData }, 200);
});

media.delete("/:key", async (c) => {
  const key = c.req.param("key");
  await mediaService.deleteFile(key);

  return c.json({ message: "File removed" }, 200);
});

media.get("/data", validateMediaDataIdsQuery, async (c) => {
  const { ids, columns } = c.req.valid("query");
  const files = await mediaService.getFilesData(ids, columns as MediaColumn[]);
  
  return c.json({ files }, 200);
});

// media.get("/all-data", async (c) => {
//   const mediaData = await mediaService.getAllMediaData();
//   return c.json(mediaData, 200);
// });

// media.delete("/purge", async (c) => {
//   const deletedItemsCount = await mediaService.clearMediaTable();
//   return c.json({ message: `Purged ${deletedItemsCount} items` }, 200);
// });

export default media;
