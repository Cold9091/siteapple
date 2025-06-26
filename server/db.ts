import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import postgres from "postgres";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import path from "path";
import fs from "fs";

const envUrl = process.env.DATABASE_URL;

let dbInstance: ReturnType<typeof drizzlePostgres> | ReturnType<typeof drizzleSQLite>;

if (envUrl && envUrl.startsWith("postgres")) {
  const client = postgres(envUrl, { prepare: true });
  console.log("Using Postgres database");
  dbInstance = drizzlePostgres(client, { schema });
} else {
  const filePath = path.resolve(process.cwd(), "database.sqlite");
  if (!fs.existsSync(filePath)) {
    console.log("Creating local SQLite database at", filePath);
  }
  const sqlite = new Database(filePath);
  console.log("Using SQLite database");
  dbInstance = drizzleSQLite(sqlite, { schema });
}

export const db = dbInstance;