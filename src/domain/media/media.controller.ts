import { Hono } from "hono";
import { validateMediaQuery, validateMediaUploadForm } from "@media/media.validator";
import { mediaService } from "@common/common.singleton";
import { userAuthMiddleware } from "@middleware/middleware.user-auth";
import { AppEnv } from "@/types";
import { MediaColumn } from "./media.types";
import { adminCheckMiddleware } from "@middleware/middleware.admin-check";
import { BadRequestError } from "@common/common.http-error";

const media = new Hono<AppEnv>();

media.use("*", userAuthMiddleware, adminCheckMiddleware);

media.get("/", validateMediaQuery, async (c) => {
  const { id, column, withUrl } = c.req.valid("query");
  const data = await mediaService.getFilesData(id, column as MediaColumn[], withUrl);

  return data.length === 0 
    ? c.body(null, 204)
    : c.json({ data }, 200);
});

media.put("/", validateMediaUploadForm, async (c) => {
  const uploadForm = c.req.valid("form");
  const uploaderId = c.get("user").userId;
  
  const data = await mediaService.saveFile(uploadForm, uploaderId);

  return c.json({ message: "File uploaded", data }, 200);
});

media.delete("/:key", async (c) => {
  const key = c.req.param("key");
  if (!key) throw new BadRequestError("Key required");

  const deleted = await mediaService.deleteFile(key);

  return c.json({ message: "File removed", deleted }, 200);
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
