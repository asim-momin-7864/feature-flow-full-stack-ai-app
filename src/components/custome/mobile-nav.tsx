"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Menu, MessageSquare, Plus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/auth/theme-switcher";
import { LogoutButton } from "@/components/auth/logout-button";
import { EnvVarWarning } from "@/components/auth/env-var-warning";
import { UserAvatar } from "@/components/custome/user-avatar";

type MobileNavProps = {
  isAdmin: boolean;
  isLoggedIn: boolean;
  userName?: string | null;
  userEmail?: string | null;
  avatarUrl?: string | null;
  hasEnvVars: boolean;
};

export function MobileNav({
  isAdmin,
  isLoggedIn,
  userName,
  userEmail,
  avatarUrl,
  hasEnvVars,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Feedback Board", icon: MessageSquare },
    { href: "/roadmap", label: "Roadmap", icon: Map },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin Dashboard", icon: ShieldCheck }]
      : []),
  ];

  const closeMenu = () => setOpen(false);

  return (
    <div className="flex items-center gap-2 md:hidden">
      {hasEnvVars && isLoggedIn && (
        <Link
          href="/feedback/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary/15 px-3 text-sm font-medium text-foreground transition-colors hover:bg-primary/25 whitespace-nowrap"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span>New</span>
        </Link>
      )}

      {hasEnvVars && !isLoggedIn && (
        <Link
          href="/auth/login"
          className={buttonVariants({
            size: "sm",
            variant: "outline",
            className: "h-9 px-3 text-sm",
          })}
        >
          Sign in
        </Link>
      )}

      <ThemeSwitcher />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Open navigation menu"
            />
          }
        >
          <Menu className="size-5" aria-hidden="true" />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[82dvw] max-w-xs gap-0 p-0"
        >
          <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
            <SheetTitle className="text-base font-bold tracking-tight">
              Feature Flow
            </SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation and account menu
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
            {!hasEnvVars && (
              <div className="rounded-xl border border-dashed p-3">
                <EnvVarWarning />
              </div>
            )}

            {hasEnvVars && isLoggedIn && (
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 p-3">
                <div className="size-10 shrink-0 overflow-hidden rounded-full border bg-muted">
                  <UserAvatar
                    url={avatarUrl}
                    fallbackText={
                      userName?.charAt(0) || userEmail?.charAt(0) || "U"
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {userName || "User"}
                    </p>
                    {isAdmin && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        Admin
                      </Badge>
                    )}
                  </div>
                  {userEmail && (
                    <p className="truncate text-xs text-muted-foreground">
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>
            )}

            {hasEnvVars && (
              <div>
                {isLoggedIn ? (
                  <Link
                    href="/feedback/new"
                    onClick={closeMenu}
                    className={buttonVariants({
                      className: "h-10 w-full justify-center gap-1.5 font-semibold",
                    })}
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    <span>New Feedback</span>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      onClick={closeMenu}
                      className={buttonVariants({
                        variant: "outline",
                        className: "h-10 w-full justify-center",
                      })}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      onClick={closeMenu}
                      className={buttonVariants({
                        variant: "default",
                        className: "h-10 w-full justify-center",
                      })}
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            )}

            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Navigation
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors",
                      isActive
                        ? "bg-muted font-semibold text-foreground ring-1 ring-border/70"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="ml-auto size-1.5 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {hasEnvVars && isLoggedIn && (
            <SheetFooter className="border-t border-border/60 px-4 py-4">
              <LogoutButton
                className="h-10 w-full justify-center gap-2"
                showIcon
                onAction={closeMenu}
              />
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
