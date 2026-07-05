// Cloudflare Worker bindings available at runtime via getCloudflareContext().env.
//
// We declare a minimal D1 surface here rather than referencing
// `@cloudflare/workers-types` globally: that package is a global script that
// overrides the DOM lib's Request/Response (making req.json() return `unknown`)
// and would break request parsing across every route. This covers what the
// repository layer uses. Regenerate the full env with: npm run cf-typegen

interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = Record<string, unknown>>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

// Merges with @opennextjs/cloudflare's global CloudflareEnv.
interface CloudflareEnv {
  /** D1 database binding (users, otp_codes, bills, subscriptions, payments). */
  DB: D1Database;
}
