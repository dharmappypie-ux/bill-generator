import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE = "bg_session";
const ONE_WEEK = 60 * 60 * 24 * 7;

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export type SessionPayload = {
  uid: string;
  email: string;
  name?: string | null;
};

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ONE_WEEK}s`)
    .sign(secret());
}

/** Sets the httpOnly session cookie for the given user. */
export async function startSession(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Returns the decoded session payload, or null if unauthenticated. */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      uid: String(payload.uid),
      email: String(payload.email),
      name: (payload.name as string | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

/** Full user record for the current session, including subscription. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.uid },
    include: { subscription: true },
  });
}

export function generateOtp(): string {
  // 6-digit numeric code. Avoid Math.random bias concerns — fine for OTP.
  let code = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 6; i++) code += (bytes[i] % 10).toString();
  return code;
}

export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 8);
}

export async function verifyOtp(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}
