import { z } from "zod";
import { Document } from "../db/models.ts";
// @ts-types="@types/express"
import express from "express";

// deno-lint-ignore no-explicit-any
export const EXTENSIONS: Record<string, TExtension<any>> = {};

export type TExtension<TContent> = {
  name: string;
  version: string;
  identifier: string;
  description: string;
  contentSchema: z.AnyZodObject;
  hooks: {
    // TODO: pass down a "ctx" object to the hooks, it'll be more useful later but for now I'll just add a logger to it
    onRegister?: () => Promise<void>;
    onCreate?: (document: Document<TContent>) => Promise<Document<TContent>>;
  };
  helpers: {
    getDocumentTitle: (document: Document<TContent>) => Promise<string>;
  };
  routes?: express.Router;
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
