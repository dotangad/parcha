import { MongoClient } from "mongodb";
// @ts-types="@types/pg"
import pg from "pg";

const uri = Deno.env.get("MONGODB_URI") || "mongodb://parcha:parcha@localhost:27017";
const client = new MongoClient(uri);

const pgclient = new pg.Client({
  host: Deno.env.get("POSTGRES_HOST") || 'postgres',
  user: Deno.env.get("POSTGRES_USER") || 'parcha',
  password: Deno.env.get("POSTGRES_PASSWORD") || 'parcha',
  database: Deno.env.get("POSTGRES_DB") || 'parcha',
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    await pgclient.connect()
    console.log("Connected to PostgreSQL");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

const db = client.db("parcha");

export { client, pgclient, connectDB };
export default db;
