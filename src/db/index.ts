import { neonConfig, Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import ws from "ws"

import * as schema from "@/db/schema"

neonConfig.webSocketConstructor = ws

const fallbackDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/halokasir"

export const databaseUrl = process.env.DATABASE_URL ?? fallbackDatabaseUrl

export function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Add your Neon connection string to .env.local."
    )
  }
}

const pool = new Pool({
  connectionString: databaseUrl,
})

export const db = drizzle(pool, { schema })

export type Database = typeof db
