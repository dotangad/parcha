import { MongoClient } from "mongodb";

const uri = Deno.env.get("MONGODB_URI") || "mongodb://parcha:parcha@localhost:27017";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

const db = client.db("parcha");

export { client, connectDB };
export default db;
