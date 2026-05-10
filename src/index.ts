import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { initDatabases } from "@/init-database";
import Auth from "@auth/auth.controller";
import Article from "@article/article.controller";
import Media from "@media/media.controller";
import MediaUtils from "@media/media.utils";

const app = new Hono();

await initDatabases();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status,
    );
  }
  console.error(err);
  return c.json(
    {
      success: false,
      message: "An internal server error occurred",
    },
    500,
  );
});

// Routes
app.route("/api/v1/auth", Auth);
app.route("/api/v1/article", Article);
app.route("/api/v1/media", Media);

const server = Bun.serve({
  port: Bun.env.PORT ?? 3000,
  fetch: app.fetch,
});

console.log(`Listening on port ${server.port}`);
console.log("Current time:", new Date().toString());
console.log("ISO time:", new Date().toISOString());

process.on("SIGTERM", async () => {
  if (Bun.env.NODE_ENV === "development") {
    try {
      console.log("Cleaning up bucket...");
      const objList = await MediaUtils.getObjectList();
      const files = objList.contents;
      if (files) {
        const keys = files.map((file) => file.key);
        await MediaUtils.deleteFromS3(keys);
        console.log("Deleted:", keys);
      } else {
        console.log("Nothing to clean.");
      }
      
      console.log("Cleaning database...");

    } catch (err) {
      console.error(err);
      server.stop();
      process.exit(1);
    }
  }

  console.log("Stopping server...");
  server.stop();
  process.exit(0);
});
