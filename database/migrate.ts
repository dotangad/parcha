import { migrate } from "postgres-migrations"
import type { MigrateDBConfig } from "postgres-migrations"
import { dbConfig } from "./index.ts"
// Run migrations
await migrate(dbConfig as MigrateDBConfig, "./migrations")
