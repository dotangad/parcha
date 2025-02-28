import type { z } from "zod";
import type DBDocument from "@parcha/database/Documents.ts";
import type { Hono } from "hono";

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
    onCreate?: (document: TDocument<TContent>) => Promise<TDocument<TContent>>;
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

