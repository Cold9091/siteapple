import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import postgres from "postgres";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import path from "path";
import fs from "fs";

const envUrl = process.env.DATABASE_URL;

// 1. If DATABASE_URL provided and starts with "postgres://" use Postgres
if (envUrl && envUrl.startsWith("postgres")) {
  const client = postgres(envUrl, { prepare: true });
  console.log("Using Postgres database");
  export const db = drizzlePostgres(client, { schema });
} else {
  // 2. Fallback to SQLite file for local development / preview
  const filePath = path.resolve(process.cwd(), "database.sqlite");
  // Ensure directory exists
  if (!fs.existsSync(filePath)) {
    console.log("Creating local SQLite database at", filePath);
  }
  const sqlite = new Database(filePath);
  console.log("Using SQLite database");
  export const db = drizzleSQLite(sqlite, { schema });
}