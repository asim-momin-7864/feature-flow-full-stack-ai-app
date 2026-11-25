import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/get-current-user";
import { UserAvatar } from "@/components/custome/user-avatar";

type AuthButtonProps = {
  userData?: User | null;
  profile?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

export async function AuthButton({
  userData: initialUserData,
  profile: initialProfile,
}: AuthButtonProps = {}) {
  const current =
    initialUserData !== undefined
      ? { userData: initialUserData, profile: initialProfile ?? null }
      : await getCurrentUser();

  const { userData, profile } = current;

  return userData ? (
    <div className="flex items-center gap-2 lg:gap-3">
      <Link
        href="/feedback/new"
        className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-primary/15 px-3 text-xs font-medium text-foreground transition-colors hover:bg-primary/25 lg:text-sm whitespace-nowrap"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        <span>New Feedback</span>
      </Link>
      <div className="flex items-center gap-2">
        <div className="size-8 shrink-0 overflow-hidden rounded-full border bg-muted">
          <UserAvatar
            url={profile?.avatar_url}
            fallbackText={
              profile?.full_name?.charAt(0) || userData.email?.charAt(0) || "U"
            }
          />
        </div>
        <span className="hidden max-w-[140px] truncate text-sm font-medium lg:inline-block">
          {profile?.full_name || userData.email}
        </span>
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className={buttonVariants({
          size: "sm",
          variant: "outline",
          className: "px-3 text-sm",
        })}
      >
        Sign in
      </Link>
      <Link
        href="/auth/sign-up"
        className={buttonVariants({
          size: "sm",
          variant: "default",
          className: "px-3 text-sm",
        })}
      >
        Sign up
      </Link>
    </div>
  );
}
