import { connect } from "@parcha/database/index.ts";
import type { Client } from "@parcha/database/index.ts";

let client: Client | null = null;

if(!client) {
  client = await connect();
}

export default () => client;
