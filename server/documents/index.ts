import { Hono } from "hono";
import client from "../client.ts";
import { inc } from "@parcha/database/lib.ts";
import { authenticated } from "../auth/middleware.ts";
import type { HonoVariables } from "../main.ts";
import { getExtension, type TDocument } from "../extensions/index.ts";

const documents = new Hono<{ Variables: HonoVariables }>();

documents.get("/", authenticated, (c) => {
  return c.json({
    success: true,
    message: "Authenticated",
    data: { user: c.get("user") },
  }, 200);
});

export type TDocumentQuery = {
  limit?: number;
  skip?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  from?: Date;
  to?: Date;
  extensions?: string[];
};

documents.post("/query/", authenticated, async (c) => {
  const { query } = await c.req.json() as { query: TDocumentQuery };

  try {
    const n = inc();
    const sql = `
      SELECT * FROM documents
      WHERE user_id = $${n()}
      ${query.extensions ? `AND extension = ANY($${n()})` : ""}
      ${query.from ? `AND created_at >= $${n()}` : ""}
      ${query.to ? `AND created_at <= $${n()}` : ""}
      ORDER BY ${query.orderBy || "created_at"} ${query.order || "DESC"}
      LIMIT ${query.limit || 10}
      OFFSET ${query.skip || 0}
    `;

    const p: unknown[] = [c.get("user")?.id, query.extensions];
    if (query.from) p.push(query.from);
    if (query.to) p.push(query.to);

    const result = await client().query<TDocument<unknown>[]>(sql, p);

    return c.json({
      success: true,
      message: "Query executed",
      data: { documents: result.rows },
    }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Failed to execute query" }, 500);
  }
});

documents.put("/update/:id", authenticated, async (c) => {
  const id = c.req.param("id");
  const { document } = await c.req.json();

  try {
    const updatedDocument = await client().query<TDocument<unknown>>(
      "UPDATE documents SET content = $1, title = $2 WHERE id = $3 returning *",
      [document, document.title, id],
    );

    if (updatedDocument.rows.length === 0) {
      return c.json({ success: false, message: "Document not found" }, 404);
    }

    return c.json({
      success: true,
      message: "Document updated",
      data: { document: updatedDocument.rows[0] },
    }, 200);
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Failed to update document" },
      500,
    );
  }
});

documents.get("/id/:id", authenticated, async (c) => {
  const id = c.req.param("id");

  try {
    const document = await client().query<TDocument<unknown>>(
      "SELECT * FROM documents WHERE id = $1",
      [id],
    );

    if (document.rows.length === 0) {
      return c.json({ success: false, message: "Document not found" }, 404);
    }

    return c.json({
      success: true,
      message: "Document found",
      data: { document: document.rows[0] },
    }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ success: false, message: "Failed to get document" }, 500);
  }
});

documents.post("/create/:ext", authenticated, async (c) => {
  const ext = c.req.param("ext");
  const extension = getExtension(ext);

  if (!extension) {
    return c.json({ success: false, message: "Extension not found" }, 404);
  }

  let { document } = await c.req.json();

  try {
    document = await extension?.hooks?.onCreate?.({
      ...document,
      userId: c.get("user")?.id,
    });
  } catch (error) {
    // TODO: pass error forward if it's validation related
    console.error(error);
    return c.json(
      { success: false, message: "Failed to create document" },
      500,
    );
  }

  try {
    const createdDocument = await client().query<TDocument<unknown>>(
      "INSERT INTO documents (user_id, extension, content, title) VALUES ($1, $2, $3, $4) RETURNING *",
      [c.get("user")?.id, ext, document?.content, document?.title],
    );

    if (createdDocument.rows.length === 0) {
      return c.json(
        { success: false, message: "Failed to create document" },
        500,
      );
    }

    return c.json({
      success: true,
      message: "Document created",
      data: { document: createdDocument.rows[0] },
    }, 201);
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Failed to create document" },
      500,
    );
  }
});

documents.delete("/delete/:id", authenticated, async (c) => {
  const id = c.req.param("id");

  try {
    const result = await client().query("DELETE FROM documents WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      return c.json({ success: false, message: "Document not found" }, 404);
    }
    return c.json({ success: true, message: "Document deleted" }, 200);
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Failed to delete document" },
      500,
    );
  }
});

export default documents;
