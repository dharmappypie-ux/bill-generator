#!/usr/bin/env bash
# One-shot Cloudflare D1 setup for bill-generator.
# Prereq (one-time, interactive): npx wrangler login
#
# Run from the project root:  bash scripts/setup-d1.sh
#
# It will:
#   1. create the D1 database (or reuse it if it already exists)
#   2. write its database_id into wrangler.jsonc
#   3. apply the schema migration to the remote D1
#   4. set the AUTH_SECRET Worker secret (generates one if you don't pass it)
set -euo pipefail

DB_NAME="bill-generator-db"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Checking wrangler login..."
if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "!! Not logged in. Run:  npx wrangler login   then re-run this script." >&2
  exit 1
fi

echo "==> Ensuring D1 database '$DB_NAME' exists..."
npx wrangler d1 create "$DB_NAME" >/dev/null 2>&1 || echo "   (already exists — reusing)"

echo "==> Fetching database_id..."
DB_ID="$(npx wrangler d1 info "$DB_NAME" --json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);process.stdout.write(String(j.uuid||j.database_id||j.id||""))})')"
if [ -z "$DB_ID" ]; then
  echo "!! Could not read database_id from 'wrangler d1 info'." >&2
  exit 1
fi
echo "   database_id = $DB_ID"

echo "==> Writing database_id into wrangler.jsonc..."
node -e '
const fs=require("fs");
const p="wrangler.jsonc";
let t=fs.readFileSync(p,"utf8");
t=t.replace(/"database_id":\s*"[^"]*"/, `"database_id": "'"$DB_ID"'"`);
fs.writeFileSync(p,t);
console.log("   updated wrangler.jsonc");
'

echo "==> Applying schema migration to remote D1..."
npx wrangler d1 migrations apply "$DB_NAME" --remote

echo "==> Setting AUTH_SECRET Worker secret..."
SECRET="${AUTH_SECRET:-$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')}"
printf '%s' "$SECRET" | npx wrangler secret put AUTH_SECRET

echo ""
echo "✅ D1 setup complete."
echo "   Next: commit wrangler.jsonc and push, then Cloudflare will redeploy with the DB bound."
echo "   (If you also want Google/Stripe/email, set those secrets too — see README.)"
