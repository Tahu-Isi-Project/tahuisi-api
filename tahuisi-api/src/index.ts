import Auth from "@auth/auth.controller";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { initDatabases } from "./init";

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

app.route("/api/v1/auth", Auth);

export default app;
