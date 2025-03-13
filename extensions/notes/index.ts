import type { TExtension, TDocument } from "@parcha/server/extensions.ts";
import { z } from "zod";

export type TContent = {
  content: unknown;
};

export default {
  name: "notes",
  identifier: "notes",
  description: "A simple note taking extension",
  version: "1.0.0",
  contentSchema: z.object({
    content: z.unknown(),
  }),
  hooks: {
    onRegister: async () => {},
    onCreate: async (document: Omit<TDocument<TContent>, "id" | "createdAt" | "updatedAt">) => {
      console.log("onCreate", document);
      return document;
    },
  },
  helpers: {
    getDocumentTitle: async (document: TDocument<TContent>) =>
      document.title,
  },
} as TExtension<TContent>;