import Auth from "@auth/auth.controller";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { initDatabases } from "./init";
import Article from "@article/article.controller";

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
  };
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

const server = Bun.serve({
  port: Bun.env.PORT ?? 3000,
  fetch: app.fetch,
});

console.log(`Listening on port ${server.port}`);

process.on("SIGTERM", () => {
  server.stop();
  process.exit(0);
});
