import { z } from "zod";
// @ts-types="@types/express"
import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Document } from "../../src/db/models.ts";
import { TExtension } from "../../src/ext/engine.ts";

export type TFile = {
  name: string;
  type: string;
  size: number;
  url: string;
};

const fileRouter = express.Router();
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: Deno.env.get("S3_ACCESS_KEY") || "",
    secretAccessKey: Deno.env.get("S3_SECRET_ACCESS_KEY") || "",
  },
});

fileRouter.get("/healthcheck", async (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: "Healthcheck",
  });
});

export default {
  name: "files",
  identifier: "files",
  description: "File storage to s3",
  version: "1.0.0",
  contentSchema: z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string(),
  }),
  hooks: {
    onRegister: async () => {},
    onCreate: async (document: Document<TFile>) => document,
  },
  helpers: {
    getDocumentTitle: async (document: Document<TFile>) =>
      document.content.name,
  },
  routes: fileRouter,
} as TExtension<TFile>;
