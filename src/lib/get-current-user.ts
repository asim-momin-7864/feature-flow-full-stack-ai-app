import type { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import ensureProfile from "./ensure-profile";

type CurrentUser = {
  isAdmin: boolean;
  userData: User | null;
  profile: any | null;
  errorMessage: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  // not logged in
  if (!data.user) {
    return {
      isAdmin: false,
      userData: null,
      profile: null,
      errorMessage: null,
    };
  }

  // logged in: get the profile, or create it if this is a new user
  const { profile, error } = await ensureProfile(data.user);

  if (!profile) {
    return {
      isAdmin: false,
      userData: null,
      profile: null,
      errorMessage: error,
    };
  }

  return {
    isAdmin: profile.role === "ADMIN",
    userData: data.user,
    profile,
    errorMessage: null,
  };
}
