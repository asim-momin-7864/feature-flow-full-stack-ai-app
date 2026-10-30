import type { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";

const DEFAULT_AVATAR =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

// returns the user's profile row, and creates it the first time
const ensureProfile = async (user: User) => {
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) return { profile: null, error: fetchError.message };
  if (existing) return { profile: existing, error: null };

  const { data: created, error: createError } = await supabase
    .from("profile")
    .insert({
      id: user.id,
      full_name:
        user.user_metadata.full_name || user.user_metadata.name || "No name",
      avatar_url: user.user_metadata.avatar_url || DEFAULT_AVATAR,
    })
    .select() // without this, insert returns no row
    .single();

  if (createError) return { profile: null, error: createError.message };
  return { profile: created, error: null };
};

export default ensureProfile;
