import bodyParser from "npm:body-parser@1.20.2";
import cors from "npm:cors@2.8.5";
import express from "npm:express@5.0.0-beta.1";
import morgan from "npm:morgan@1.10.0";
import { authrouter } from "./auth.ts";
import { docrouter } from "./documents.ts";
import { registerExtension } from "./ext/engine.ts";
import notes from "../extensions/notes/index.ts";

// Register extensions
registerExtension(notes);

const app = express();

// Logger
app.use(morgan("dev"));

// CORS
app.use(cors());

// Body parser
app.use(bodyParser.json());

app.use("/v1/auth", authrouter);
app.use("/v1/documents", docrouter);

// Handle 404s
app.use((_: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

export default app;
