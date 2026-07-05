import { getCloudflareContext } from "@opennextjs/cloudflare";

// Returns the D1 database binding for the current request.
// The binding name ("DB") is declared in wrangler.jsonc and the Cloudflare
// dashboard. Bindings are only available during a request, so call this
// inside route handlers / server actions — never at module top-level.
export function getDB(): D1Database {
  const { env } = getCloudflareContext();
  const db = env.DB;
  if (!db) {
    throw new Error(
      "D1 binding 'DB' is not configured. Create the database and bind it (see wrangler.jsonc)."
    );
  }
  return db;
}
