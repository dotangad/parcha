import { sql } from "@pgtyped/runtime";
import { IUpsertUserQuery } from "./auth.types.ts";

export const upsertUser = sql<IUpsertUserQuery>`insert into users (email, name, google_id, picture)
  values ($email, $name, $google_id, $picture)
  on conflict (email) do update set
    name = $name,
    google_id = $google_id,
    picture = $picture`;