import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

function createDb() {
  const url = env.TURSO_DATABASE_URL ?? "file:./.data/sable.db";
  const client = createClient({
    url,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
