import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import client from "./client.ts";
import type User from "@parcha/database/Users.ts";

export type HonoVariables = {
  user?: User;
};

const app = new Hono();

// Logger
app.use(logger());

const api = new Hono<{
  Variables: HonoVariables;
}>();

// CORS
api.use(cors());

// Healthcheck
api.get("/healthcheck", async (c) => {
  try {
    await client().query("select 1");
    return c.json({ success: true, message: "Database connected!" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
});

app.route("/api/v1/", api);
Deno.serve({
  onListen({ hostname, port }) {
    console.log(`Server started at http://${hostname}:${port}`);
  },
  port: parseInt(Deno.env.get("PORT") || "8080"),
}, app.fetch);