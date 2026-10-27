//* this is special admin supabase client - which have super admin previliges
"server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

//
if (!supabaseUrl || !secretKey) {
  throw new Error("missing supabase url or secret key");
}

export const supabaseAdmin = createClient(supabaseUrl, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
