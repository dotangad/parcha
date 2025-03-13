import type { z } from "zod";
import type DBDocument from "@parcha/database/Documents.ts";
import type { Hono } from "hono";
import type Edges from "@parcha/database/Edges.ts";

// deno-lint-ignore no-explicit-any
export const EXTENSIONS: Record<string, TExtension<any>> = {};

export type TDocument<TContent> = DBDocument & {
  content: TContent;
};

export type TExtension<TContent> = {
  name: string;
  version: string;
  identifier: string;
  description: string;
  icon?: string;
  contentSchema: z.AnyZodObject;
  hooks: {
    // TODO: pass down a "ctx" object to the hooks, it'll be more useful later but for now I'll just add a logger to it
    onRegister?: () => Promise<void>;
    onCreate?: (
      document: Omit<TDocument<TContent>, "id" | "createdAt" | "updatedAt">,
    ) => Promise<Omit<TDocument<TContent>, "id" | "createdAt" | "updatedAt">>;
    postEdgeCreated?: (
      edge: Edges,
      self: TDocument<TContent>,
      other: TDocument<unknown>,
      selfParent: boolean,
    ) => Promise<void>;
  };
  helpers: {
    getDocumentTitle: (document: TDocument<TContent>) => Promise<string>;
  };
  routes?: Hono;
};

export async function registerExtension<TContent>(
  extension: TExtension<TContent>,
) {
  if (EXTENSIONS[extension.identifier]) {
    throw new Error(`Extension ${extension.identifier} already registered`);
  }

  extension.hooks.onRegister && await extension.hooks.onRegister();

  EXTENSIONS[extension.identifier] = extension;
}

export function getExtension(identifier: string) {
  return EXTENSIONS[identifier];
}
