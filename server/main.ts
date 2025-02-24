import { connect, dbConfig } from "@parcha/database/index.ts";

const client = await connect({
  ...dbConfig,
  host: "localhost",
});

const result = await client.query("SELECT $1::text as message", ["Hello world!"]);

console.log(result.rows);

