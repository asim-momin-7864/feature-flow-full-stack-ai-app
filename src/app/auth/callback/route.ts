import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  // not get code from google
  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/error?error=NoCodeProvided", request.url),
    );
  }

  const supabase = await createClient();

  // exchange the code for login session
  const { error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    console.error("exchangeCodeForSession error:", sessionError.message);
    return NextResponse.redirect(
      new URL(
        `/auth/error?error=${encodeURIComponent(sessionError.message)}`,
        request.url,
      ),
    );
  }

  // redirect to home
  return NextResponse.redirect(new URL(next, request.url));
}
