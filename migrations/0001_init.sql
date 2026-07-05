-- Bill Generator — initial D1 schema.
-- Mirrors the former Prisma models. Booleans are stored as INTEGER (0/1),
-- timestamps as TEXT ISO-8601 strings. Column names match the app's field names.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  mobile        TEXT,
  passwordHash  TEXT,
  image         TEXT,
  provider      TEXT NOT NULL DEFAULT 'credentials',
  emailVerified INTEGER NOT NULL DEFAULT 0,
  createdAt     TEXT NOT NULL,
  updatedAt     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS otp_codes (
  id        TEXT PRIMARY KEY,
  email     TEXT NOT NULL,
  codeHash  TEXT NOT NULL,
  purpose   TEXT NOT NULL DEFAULT 'login',
  expiresAt TEXT NOT NULL,
  consumed  INTEGER NOT NULL DEFAULT 0,
  attempts  INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes (email);

CREATE TABLE IF NOT EXISTS bills (
  id        TEXT PRIMARY KEY,
  userId    TEXT NOT NULL,
  type      TEXT NOT NULL,
  title     TEXT NOT NULL,
  template  TEXT NOT NULL DEFAULT 'template-1',
  theme     TEXT NOT NULL DEFAULT 'default',
  currency  TEXT NOT NULL DEFAULT 'INR',
  data      TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_bills_user ON bills (userId);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                   TEXT PRIMARY KEY,
  userId               TEXT NOT NULL UNIQUE,
  plan                 TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'active',
  stripeCustomerId     TEXT,
  stripeSessionId      TEXT,
  stripeSubscriptionId TEXT,
  currentPeriodEnd     TEXT,
  createdAt            TEXT NOT NULL,
  updatedAt            TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id              TEXT PRIMARY KEY,
  userId          TEXT NOT NULL,
  plan            TEXT NOT NULL,
  amount          INTEGER NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'inr',
  status          TEXT NOT NULL DEFAULT 'paid',
  stripeSessionId TEXT,
  createdAt       TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (userId);
