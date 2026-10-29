import { EnvVarWarning } from "@/components/auth/env-var-warning";
import { AuthButton } from "@/components/auth/auth-button";
import { ThemeSwitcher } from "@/components/auth/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/80 backdrop-blur-md z-40">
      <div className="w-full max-w-5xl flex justify-between items-center px-3 sm:px-6 text-sm gap-2">
        {/* Left: Brand and Roadmap */}
        <div className="flex items-center gap-3 sm:gap-6 font-semibold">
          <Link
            href="/"
            className="font-bold text-sm sm:text-base tracking-tight shrink-0 hover:opacity-80 transition-opacity"
          >
            Feature Flow
          </Link>
          <Link
            href="/roadmap"
            className="text-xs sm:text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
          >
            Roadmap
          </Link>
        </div>

        {/* Right: Actions, Theme, Auth */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
