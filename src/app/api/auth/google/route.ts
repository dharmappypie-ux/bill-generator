import { NextResponse } from "next/server";

// Kicks off Google OAuth. No-op-friendly: if creds aren't set we bounce back
// with an error flag the modal can show.
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.APP_URL || "http://localhost:4040";
  if (!clientId) {
    return NextResponse.redirect(`${appUrl}/?auth_error=google_not_configured`);
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
