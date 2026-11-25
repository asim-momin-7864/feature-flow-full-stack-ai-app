import Link from "next/link";
import { Suspense } from "react";
import { EnvVarWarning } from "@/components/auth/env-var-warning";
import { AuthButton } from "@/components/auth/auth-button";
import { ThemeSwitcher } from "@/components/auth/theme-switcher";
import { NavLinks } from "@/components/custome/nav-links";
import { MobileNav } from "@/components/custome/mobile-nav";
import { getCurrentUser } from "@/lib/get-current-user";
import { hasEnvVars } from "@/lib/utils";

export async function Navbar() {
  const { isAdmin, userData, profile } = hasEnvVars
    ? await getCurrentUser()
    : { isAdmin: false, userData: null, profile: null };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: brand and desktop/tablet links */}
        <div className="flex min-w-0 items-center gap-5 lg:gap-6">
          <Link
            href="/"
            className="shrink-0 whitespace-nowrap text-base font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            Feature Flow
          </Link>
          <NavLinks isAdmin={isAdmin} />
        </div>

        {/* Right: desktop/tablet theme and auth */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
          <ThemeSwitcher />
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton userData={userData} profile={profile} />
            </Suspense>
          )}
        </div>

        {/* Right: mobile quick actions + hamburger drawer */}
        <MobileNav
          isAdmin={isAdmin}
          isLoggedIn={Boolean(userData)}
          userName={profile?.full_name}
          userEmail={userData?.email}
          avatarUrl={profile?.avatar_url}
          hasEnvVars={Boolean(hasEnvVars)}
        />
      </div>
    </header>
  );
}
