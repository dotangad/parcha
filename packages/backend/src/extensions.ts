// @ts-types="@types/express"
import express from "express";
import { EXTENSIONS } from "@/ext/engine.ts";

const extrouter = express.Router();

for (const extension of Object.values(EXTENSIONS)) {
  if (extension.routes) {
    console.log(`/${extension.identifier}`);
    extrouter.use(`/${extension.identifier}`, extension.routes);
  }
}

export default extrouter;
