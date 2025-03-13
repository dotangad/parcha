import { Hono } from "hono";
import client from "../client.ts";
import { inc } from "@parcha/database/lib.ts";
import { authenticated } from "../auth/middleware.ts";
import type { HonoVariables } from "../main.ts";
import { getExtension, type TDocument } from "../extensions/index.ts";
import type Edges from "@parcha/database/Edges.ts";

const edges = new Hono<{ Variables: HonoVariables }>();

edges.post("/create/", authenticated, async (c) => {
  const { document1, document2, parent, metadata } = await c.req.json() as Omit<
    Edges,
    "id" | "createdAt" | "updatedAt"
  >;

  try {
    const createdEdge = await client().query<Edges>(
      `INSERT INTO edges (document1, document2, parent, metadata) VALUES ($1, $2, $3, $4) returning *`,
      [document1, document2, parent, metadata],
    );

    if (createdEdge.rows.length === 0) {
      return c.json(
        { success: false, message: "Failed to create edge" },
        500,
      );
    }

    // TODO: run postEdgeCreated hook

    return c.json({
      success: true,
      message: "Edge created",
      data: { edge: createdEdge.rows[0] },
    }, 201);
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Failed to create edge" },
      500,
    );
  }
});

// TODO: edge queries -
// - get all edges for a document
// - get parent
// - get children (recursive, specify level)

export default edges;
