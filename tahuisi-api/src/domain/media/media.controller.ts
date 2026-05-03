import { Hono } from "hono";
import { validateMediaUploadForm } from "@media/media.validator";
import { internalAuthMiddleware } from "@middleware/middleware.internal-auth";
import { mediaService } from "@common/common.singleton";

const media = new Hono();

media.use("*", internalAuthMiddleware);

media.post("/", validateMediaUploadForm, async (c) => {
  const uploadForm = c.req.valid("form");
  await mediaService.saveFile(uploadForm);

  return c.json({ message: `File uploaded: ${uploadForm.file.name}` }, 200);
});

media.delete("/:id", async (c) => {
  const key = c.req.param("id");
  await mediaService.deleteFile(key);

  return c.json({ message: `Removed file: ${key}` }, 200);
});

media.get("/all-data", async (c) => {
  const mediaData = await mediaService.getAllMediaData();
  return c.json(mediaData, 200);
});

media.delete("/", async (c) => {
  await mediaService.clearMediaTable();
  return c.json({ message: "Media gone" }, 200);
});

export default media;
