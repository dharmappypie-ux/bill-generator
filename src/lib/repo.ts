import "server-only";
import { getDB } from "./db";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

function nowIso(): string {
  return new Date().toISOString();
}
function newId(): string {
  return crypto.randomUUID();
}

/* ------------------------------------------------------------------ */
/* users                                                              */
/* ------------------------------------------------------------------ */

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  mobile: string | null;
  passwordHash: string | null;
  image: string | null;
  provider: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type RawUser = Omit<UserRow, "emailVerified"> & { emailVerified: number };

function mapUser(r: RawUser | null): UserRow | null {
  if (!r) return null;
  return { ...r, emailVerified: Boolean(r.emailVerified) };
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const r = await getDB().prepare("SELECT * FROM users WHERE email = ?").bind(email).first<RawUser>();
  return mapUser(r);
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const r = await getDB().prepare("SELECT * FROM users WHERE id = ?").bind(id).first<RawUser>();
  return mapUser(r);
}

export async function createUser(input: {
  email: string;
  name?: string | null;
  mobile?: string | null;
  passwordHash?: string | null;
  image?: string | null;
  provider?: string;
  emailVerified?: boolean;
}): Promise<UserRow> {
  const id = newId();
  const now = nowIso();
  await getDB()
    .prepare(
      `INSERT INTO users (id, email, name, mobile, passwordHash, image, provider, emailVerified, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.email,
      input.name ?? null,
      input.mobile ?? null,
      input.passwordHash ?? null,
      input.image ?? null,
      input.provider ?? "credentials",
      input.emailVerified ? 1 : 0,
      now,
      now
    )
    .run();
  return (await getUserById(id))!;
}

export type UserUpdate = Partial<{
  name: string | null;
  mobile: string | null;
  passwordHash: string | null;
  image: string | null;
  provider: string;
  emailVerified: boolean;
}>;

// Whitelisted columns — never interpolate arbitrary keys into SQL.
const USER_UPDATABLE = new Set(["name", "mobile", "passwordHash", "image", "provider", "emailVerified"]);

export async function updateUser(id: string, fields: UserUpdate): Promise<UserRow | null> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || !USER_UPDATABLE.has(k)) continue;
    sets.push(`${k} = ?`);
    vals.push(k === "emailVerified" ? (v ? 1 : 0) : v);
  }
  if (sets.length === 0) return getUserById(id);
  sets.push("updatedAt = ?");
  vals.push(nowIso());
  vals.push(id);
  await getDB().prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
  return getUserById(id);
}

/** Insert on first sight, otherwise apply `update`. Used by OAuth / OTP login. */
export async function upsertUserByEmail(
  email: string,
  create: Omit<Parameters<typeof createUser>[0], "email">,
  update: UserUpdate
): Promise<UserRow> {
  const existing = await getUserByEmail(email);
  if (existing) {
    return (await updateUser(existing.id, update))!;
  }
  return createUser({ email, ...create });
}

/* ------------------------------------------------------------------ */
/* otp codes                                                          */
/* ------------------------------------------------------------------ */

export type OtpRow = {
  id: string;
  email: string;
  codeHash: string;
  purpose: string;
  expiresAt: string;
  consumed: number;
  attempts: number;
  createdAt: string;
};

export async function invalidateOtps(email: string, purpose: string): Promise<void> {
  await getDB()
    .prepare("UPDATE otp_codes SET consumed = 1 WHERE email = ? AND purpose = ? AND consumed = 0")
    .bind(email, purpose)
    .run();
}

export async function createOtp(
  email: string,
  codeHash: string,
  purpose: string,
  expiresAt: string
): Promise<void> {
  await getDB()
    .prepare(
      "INSERT INTO otp_codes (id, email, codeHash, purpose, expiresAt, consumed, attempts, createdAt) VALUES (?, ?, ?, ?, ?, 0, 0, ?)"
    )
    .bind(newId(), email, codeHash, purpose, expiresAt, nowIso())
    .run();
}

export async function getLatestActiveOtp(email: string, purpose: string): Promise<OtpRow | null> {
  return getDB()
    .prepare(
      "SELECT * FROM otp_codes WHERE email = ? AND purpose = ? AND consumed = 0 ORDER BY createdAt DESC LIMIT 1"
    )
    .bind(email, purpose)
    .first<OtpRow>();
}

export async function consumeOtp(id: string): Promise<void> {
  await getDB().prepare("UPDATE otp_codes SET consumed = 1 WHERE id = ?").bind(id).run();
}

export async function incrementOtpAttempts(id: string): Promise<void> {
  await getDB().prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?").bind(id).run();
}

/* ------------------------------------------------------------------ */
/* bills                                                              */
/* ------------------------------------------------------------------ */

export type BillRow = {
  id: string;
  userId: string;
  type: string;
  title: string;
  template: string;
  theme: string;
  currency: string;
  data: string;
  createdAt: string;
  updatedAt: string;
};

export type BillSummary = Pick<
  BillRow,
  "id" | "type" | "title" | "template" | "theme" | "currency" | "updatedAt"
>;

export async function listBills(userId: string): Promise<BillSummary[]> {
  const { results } = await getDB()
    .prepare(
      "SELECT id, type, title, template, theme, currency, updatedAt FROM bills WHERE userId = ? ORDER BY updatedAt DESC"
    )
    .bind(userId)
    .all<BillSummary>();
  return results ?? [];
}

export async function createBill(input: {
  userId: string;
  type: string;
  title: string;
  template: string;
  theme: string;
  currency: string;
  data: string;
}): Promise<{ id: string }> {
  const id = newId();
  const now = nowIso();
  await getDB()
    .prepare(
      "INSERT INTO bills (id, userId, type, title, template, theme, currency, data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(id, input.userId, input.type, input.title, input.template, input.theme, input.currency, input.data, now, now)
    .run();
  return { id };
}

export async function getBill(id: string, userId: string): Promise<BillRow | null> {
  return getDB().prepare("SELECT * FROM bills WHERE id = ? AND userId = ?").bind(id, userId).first<BillRow>();
}

export async function updateBill(
  id: string,
  fields: { title: string; template: string; theme: string; currency: string; data: string }
): Promise<void> {
  await getDB()
    .prepare("UPDATE bills SET title = ?, template = ?, theme = ?, currency = ?, data = ?, updatedAt = ? WHERE id = ?")
    .bind(fields.title, fields.template, fields.theme, fields.currency, fields.data, nowIso(), id)
    .run();
}

export async function deleteBill(id: string): Promise<void> {
  await getDB().prepare("DELETE FROM bills WHERE id = ?").bind(id).run();
}

/* ------------------------------------------------------------------ */
/* subscriptions                                                      */
/* ------------------------------------------------------------------ */

export type SubscriptionRow = {
  id: string;
  userId: string;
  plan: string;
  status: string;
  stripeCustomerId: string | null;
  stripeSessionId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getSubscription(userId: string): Promise<SubscriptionRow | null> {
  return getDB().prepare("SELECT * FROM subscriptions WHERE userId = ?").bind(userId).first<SubscriptionRow>();
}

export async function upsertSubscription(
  userId: string,
  data: {
    plan: string;
    status: string;
    stripeCustomerId?: string | null;
    stripeSessionId?: string | null;
    stripeSubscriptionId?: string | null;
    currentPeriodEnd?: string | null;
  }
): Promise<void> {
  const existing = await getSubscription(userId);
  const now = nowIso();
  if (existing) {
    await getDB()
      .prepare(
        "UPDATE subscriptions SET plan = ?, status = ?, stripeCustomerId = ?, stripeSessionId = ?, stripeSubscriptionId = ?, currentPeriodEnd = ?, updatedAt = ? WHERE userId = ?"
      )
      .bind(
        data.plan,
        data.status,
        data.stripeCustomerId ?? existing.stripeCustomerId ?? null,
        data.stripeSessionId ?? null,
        data.stripeSubscriptionId ?? existing.stripeSubscriptionId ?? null,
        data.currentPeriodEnd ?? null,
        now,
        userId
      )
      .run();
  } else {
    await getDB()
      .prepare(
        "INSERT INTO subscriptions (id, userId, plan, status, stripeCustomerId, stripeSessionId, stripeSubscriptionId, currentPeriodEnd, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(
        newId(),
        userId,
        data.plan,
        data.status,
        data.stripeCustomerId ?? null,
        data.stripeSessionId ?? null,
        data.stripeSubscriptionId ?? null,
        data.currentPeriodEnd ?? null,
        now,
        now
      )
      .run();
  }
}

/* ------------------------------------------------------------------ */
/* payments                                                           */
/* ------------------------------------------------------------------ */

export type PaymentRow = {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
};

export async function listPayments(userId: string, limit = 50): Promise<PaymentRow[]> {
  const { results } = await getDB()
    .prepare(
      "SELECT id, plan, amount, currency, status, createdAt FROM payments WHERE userId = ? ORDER BY createdAt DESC LIMIT ?"
    )
    .bind(userId, limit)
    .all<PaymentRow>();
  return results ?? [];
}

export async function createPayment(input: {
  userId: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId?: string | null;
}): Promise<void> {
  await getDB()
    .prepare(
      "INSERT INTO payments (id, userId, plan, amount, currency, status, stripeSessionId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(newId(), input.userId, input.plan, input.amount, input.currency, input.status, input.stripeSessionId ?? null, nowIso())
    .run();
}
