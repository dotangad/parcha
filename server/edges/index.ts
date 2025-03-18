import { Hono } from "hono";
import client from "../client.ts";
// import { inc } from "@parcha/database/lib.ts";
import { authenticated } from "../auth/middleware.ts";
import type { HonoVariables } from "../main.ts";
import type { TDocument } from "../extensions/index.ts";
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

// TODO: add recursive option
// This route fetches the parent of a document if the edge exists
// For an edge to represent a parent-child relationship, the edge must have edge.parent = true
// If edge.parent = true, then edge.document1 is considered the parent of edge.document2
edges.get("/parentof/:id/", authenticated, async (c) => {
  const documentId = c.req.param("id");

  try {
    const document = await client().query<TDocument<unknown>>(
      "SELECT * FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, c.get("user")?.id],
    );

    if (document.rows.length === 0) {
      return c.json({ success: false, message: "Document not found" }, 404);
    }

    const edges = await client().query(
      `select jsonb_build_object(
        'edge_id', e.id,
        'child_id', e.document2,
        'metadata', e.metadata,
        'parent', jsonb_build_object(
          'id', d.id,
          'user_id', d.user_id,
          'extension', d.extension,
          'content', d.content,
          'created_at', d.created_at,
          'updated_at', d.updated_at,
          'title', d.title
        )
      ) as edge from edges e
      join documents d on d.id = e.document1
      where e.document2 = $1 and e.parent = true`,
      [documentId],
    );

    return c.json({
      success: true,
      message: "Edges fetched successfully",
      data: {
        edges: edges.rows.map((x: { edge: unknown }) => x.edge) as {
          edge_id: string;
          child_id: string;
          metadata: unknown;
          created_at: Date;
          updated_at: Date;
          parent: {
            id: string;
            user_id: string;
            extension: string;
            content: string;
            created_at: Date;
            updated_at: Date;
            title: string;
          };
        }[],
      },
    }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Failed to fetch edges" }, 500);
  }
});

// TODO: add recursive option
// This route fetches the direct child of a document if the edge exists
// For an edge to represent a parent-child relationship, the edge must have edge.parent = true
// If edge.parent = true, then edge.document2 is considered the child of edge.document1
edges.get("/childof/:id/", authenticated, async (c) => {
  const documentId = c.req.param("id");

  try {
    const document = await client().query<TDocument<unknown>>(
      "SELECT * FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, c.get("user")?.id],
    );

    if (document.rows.length === 0) {
      return c.json({ success: false, message: "Document not found" }, 404);
    }

    const edges = await client().query(
      `select jsonb_build_object(
        'edge_id', e.id,
        'parent_id', e.document1,
        'metadata', e.metadata,
        'child', jsonb_build_object(
          'id', d.id,
          'user_id', d.user_id,
          'extension', d.extension,
          'content', d.content,
          'created_at', d.created_at,
          'updated_at', d.updated_at,
          'title', d.title
        )
      ) as edge from edges e
      join documents d on d.id = e.document2
      where e.document1 = $1 and e.parent = true`,
      [documentId],
    );

    return c.json({
      success: true,
      message: "Edges fetched successfully",
      data: {
        edges: edges.rows.map((x: { edge: unknown }) => x.edge) as {
          edge_id: string;
          child_id: string;
          metadata: unknown;
          created_at: Date;
          updated_at: Date;
          parent: {
            id: string;
            user_id: string;
            extension: string;
            content: string;
            created_at: Date;
            updated_at: Date;
            title: string;
          };
        }[],
      },
    }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Failed to fetch edges" }, 500);
  }
});

edges.get("/all/:id/", authenticated, async (c) => {
  const documentId = c.req.param("id");

  try {
    const document = await client().query<TDocument<unknown>>(
      "SELECT * FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, c.get("user")?.id],
    );

    if (document.rows.length === 0) {
      return c.json({ success: false, message: "Document not found" }, 404);
    }

    const edges = await client().query(
      `WITH related_edges AS (
          SELECT *
          FROM edges
          WHERE document1 = $1 OR document2 = $1
      )
      SELECT jsonb_build_object(
          'edge_id', e.id,
          'parent', e.parent,
          'metadata', e.metadata,
          'created_at', e.created_at,
          'updated_at', e.updated_at,
          'related_document', jsonb_build_object(
              'id', d.id,
              'user_id', d.user_id,
              'extension', d.extension,
              'content', d.content,
              'created_at', d.created_at,
              'updated_at', d.updated_at,
              'title', d.title
          )
      ) AS edge_with_related_document
      FROM related_edges e
      JOIN documents d
          ON d.id = CASE
              WHEN e.document1 = $1 THEN e.document2
              ELSE e.document1
          END`,
      [documentId],
    );

    return c.json({
      success: true,
      message: "Edges fetched successfully",
      data: {
        edges: edges.rows.map((x) => x.edge_with_related_document) as {
          edge_id: string;
          parent: boolean;
          metadata: unknown;
          created_at: Date;
          updated_at: Date;
          related_document: {
            id: string;
            user_id: string;
            extension: string;
            content: string;
            created_at: Date;
            updated_at: Date;
            title: string;
          };
        }[],
      },
    }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Failed to fetch edges" }, 500);
  }
});

export default edges;
