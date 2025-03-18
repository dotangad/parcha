import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import client from "./client.ts";
import auth from "./auth/index.ts";
import documents from "./documents/index.ts";
import edges from "./edges/index.ts";
import { registerExtension } from "./extensions/index.ts";
import notes from "@parcha/notes";
import type User from "@parcha/database/Users.ts";

registerExtension(notes);

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
api.get("/healthcheck/", async (c) => {
  try {
    await client().query("select 1");
    return c.json({ success: true, message: "Database connected!" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
});

api.route("/auth", auth);
api.route("/documents", documents);
api.route("/edges", edges);

app.route("/api/v1/", api);

// TODO: mount extension routes

showRoutes(app, {
  verbose: true,
});

Deno.serve({
  onListen({ hostname, port }) {
    console.log(`Server started at http://${hostname}:${port}`);
  },
  port: parseInt(Deno.env.get("PORT") || "8080"),
}, app.fetch);
