import pg from "pg"

export const dbConfig = {
  database: Deno.env.get("POSTGRES_DB") || "parcha",
  user: Deno.env.get("POSTGRES_USER") || "parcha",
  password: Deno.env.get("POSTGRES_PASSWORD") || "parcha",
  host: Deno.env.get("POSTGRES_HOST") || "postgres",
  port: parseInt(Deno.env.get("POSTGRES_PORT") || "5432"),

  // Default: false for backwards-compatibility
  // This might change!
  ensureDatabaseExists: true,

  // Default: "postgres"
  // Used when checking/creating "database-name"
  defaultDatabase: "postgres"
}

export async function connect(config: pg.ClientConfig = dbConfig) {
  try {
    const client = new pg.Client(config);
    await client.connect();
    return client;
  } catch (err) {
    console.error("Failed to connect to database:", err);
    throw err;
  }
}