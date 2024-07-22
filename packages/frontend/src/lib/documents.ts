import { TAPIResponse } from "backend/src/lib/api_types.ts";
import { TDocumentQuery } from "backend/src/lib/documents.ts";
import { Document } from "backend/src/db/models.ts";

export function queryDocuments(
  token: string,
  query: TDocumentQuery,
): () => Promise<TAPIResponse<{ documents: Document[] }>> {
  return async function () {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/documents/query`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ query }),
      },
    );

    // TODO: handle success: false case
    return await response.json() as TAPIResponse<{ documents: Document[] }>;
  };
}

export function fetchDocumentById(
  token: string,
  id: string,
): () => Promise<TAPIResponse<Document>> {
  return async function () {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/documents/find/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      },
    );

    // TODO: handle success: false case
    return await response.json();
  };
}
