import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use the direct (non-pooled) connection for schema operations.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
