import { migrate } from "postgres-migrations"

const dbConfig = {
  database: "parcha",
  user: "parcha",
  password: "parcha",
  host: "localhost",
  port: 5432,

  // Default: false for backwards-compatibility
  // This might change!
  ensureDatabaseExists: true,

  // Default: "postgres"
  // Used when checking/creating "database-name"
  defaultDatabase: "postgres"
}

await migrate(dbConfig, "./database/migrations")