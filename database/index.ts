// @ts-types="@types/pg"
import pg from "pg";

export const Client = pg.Client;
export type ClientConfig = pg.ClientConfig;
export type Client = pg.Client;

export const dbConfig: ClientConfig = {
  database: Deno.env.get("POSTGRES_DB") || "parcha",
  user: Deno.env.get("POSTGRES_USER") || "parcha",
  password: Deno.env.get("POSTGRES_PASSWORD") || "parcha",
  host: Deno.env.get("POSTGRES_HOST") || "localhost",
  port: parseInt(Deno.env.get("POSTGRES_PORT") || "5432"),
}

export async function connect(config = dbConfig): Promise<Client> {
  try {
    const client = new Client(config);

    await client.connect();
    return client;
  } catch (err) {
    console.error("Failed to connect to database:", err);
    throw err;
  }
}