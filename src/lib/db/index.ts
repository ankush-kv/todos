import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "@/lib/env";
import * as schema from "./schema";

// The connection string points at Supabase's transaction-mode pooler
// (pgbouncer), which does not support prepared statements — disable them.
const client = postgres(DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
