import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

// email confirmation links route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  // If no token or type, something is wrong with the link
  if (!token_hash || !type) {
    redirect("/auth/error?error=No token hash or type");
  }

  const supabase = await createClient();

  // verify the email token
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (verifyError) {
    redirect(`/auth/error?error=${verifyError.message}`);
  }

  // all good, redirect
  redirect(next);
}
