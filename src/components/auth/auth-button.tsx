import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/get-current-user";

import { UserAvatar } from "@/components/custome/user-avatar";

export async function AuthButton() {
  const { isAdmin, userData, profile, errorMessage } = await getCurrentUser();

  return userData ? (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/feedback/new"
        className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium bg-primary/10 hover:bg-primary/20 text-foreground px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <span className="font-bold">+</span>
        <span className="hidden sm:inline">New Feedback</span>
        <span className="sm:hidden">New</span>
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase overflow-hidden border relative">
          <UserAvatar
            url={profile?.avatar_url}
            fallbackText={
              profile?.full_name?.charAt(0) || userData.email?.charAt(0) || "U"
            }
          />
        </div>
        <span className="text-xs sm:text-sm font-medium hidden sm:inline-block max-w-[120px] truncate">
          {profile?.full_name || userData.email}
        </span>
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        href="/auth/login"
        className={buttonVariants({
          size: "sm",
          variant: "outline",
          className: "text-xs sm:text-sm px-2.5 sm:px-3",
        })}
      >
        Sign in
      </Link>
      <Link
        href="/auth/sign-up"
        className={buttonVariants({
          size: "sm",
          variant: "default",
          className: "text-xs sm:text-sm px-2.5 sm:px-3",
        })}
      >
        Sign up
      </Link>
    </div>
  );
}
