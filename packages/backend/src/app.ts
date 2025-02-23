// @ts-types="@types/body-parser"
import bodyParser from "body-parser";
// @ts-types="@types/cors"
import cors from "cors";
// @ts-types="@types/express"
import express from "express";
// @ts-types="@types/morgan"
import morgan from "morgan";
import { authrouter } from "@/auth.ts";
import { docrouter } from "@/documents.ts";
import { registerExtension } from "@/ext/engine.ts";
import notes from "@extensions/notes/index.ts";
import files from "@extensions/files/index.ts";
// Register extensions
registerExtension(notes);
registerExtension(files);

const app = express();

// Logger
app.use(morgan("dev"));

// CORS
app.use(cors());

// Body parser
app.use(bodyParser.json());

app.use("/v1/auth", authrouter);
app.use("/v1/documents", docrouter);

// This needs to be a dynamic import since extension routes are only registered when the app is started
const extrouter = await import("./extensions.ts");
app.use("/v1/extensions", extrouter.default);

// Handle 404s
app.use((_: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

export default app;
