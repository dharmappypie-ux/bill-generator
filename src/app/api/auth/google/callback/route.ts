import { NextRequest, NextResponse } from "next/server";
import { upsertUserByEmail } from "@/lib/repo";
import { startSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const appUrl = process.env.APP_URL || "http://localhost:4040";
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const code = req.nextUrl.searchParams.get("code");

  if (!clientId || !clientSecret || !code) {
    return NextResponse.redirect(`${appUrl}/?auth_error=google_failed`);
  }

  try {
    const redirectUri = `${appUrl}/api/auth/google/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(`${appUrl}/?auth_error=google_failed`);
    }

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();
    if (!profile.email) {
      return NextResponse.redirect(`${appUrl}/?auth_error=google_failed`);
    }

    const user = await upsertUserByEmail(
      String(profile.email).toLowerCase(),
      {
        name: profile.name || null,
        image: profile.picture || null,
        provider: "google",
        emailVerified: true,
      },
      {
        name: profile.name || undefined,
        image: profile.picture || undefined,
        emailVerified: true,
      }
    );

    await startSession({ uid: user.id, email: user.email, name: user.name });
    return NextResponse.redirect(`${appUrl}/dashboard`);
  } catch {
    return NextResponse.redirect(`${appUrl}/?auth_error=google_failed`);
  }
}
