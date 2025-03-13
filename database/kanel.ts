import kanel from "kanel";
import kanelZod from "kanel-zod";

const config: kanel.Config = {
  connection: {
    host: "localhost",
    user: "parcha",
    password: "parcha",
    database: "parcha",
  },

  preDeleteOutputFolder: true,
  outputPath: "./types",

  customTypeMap: {},

  preRenderHooks: [kanelZod.generateZodSchemas, kanelZod.zodCamelCaseHook],
};

await kanel.processDatabase(config);
