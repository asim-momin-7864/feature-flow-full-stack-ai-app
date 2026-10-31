import { EnvVarWarning } from "@/components/auth/env-var-warning";
import { AuthButton } from "@/components/auth/auth-button";
import { ThemeSwitcher } from "@/components/auth/theme-switcher";
import { getCurrentUser } from "@/lib/get-current-user";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

const navLinkClass =
  "text-sm font-normal text-muted-foreground hover:text-foreground transition-colors";

export async function Navbar() {
  const { isAdmin } = await getCurrentUser();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-b-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2 text-sm sm:h-16 sm:flex-nowrap sm:px-6 sm:py-0">
        {/* Left: brand and links */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="shrink-0 text-base font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            Feature Flow
          </Link>
          <Link href="/roadmap" className={navLinkClass}>
            Roadmap
          </Link>
          {isAdmin && (
            <Link href="/admin" className={navLinkClass}>
              Admin
            </Link>
          )}
        </div>

        {/* Right: theme and auth (wraps to its own row on phones) */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
      </div>
    </nav>
  );
}
