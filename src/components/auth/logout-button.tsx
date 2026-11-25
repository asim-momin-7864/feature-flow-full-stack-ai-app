"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  showIcon = false,
  onAction,
}: {
  className?: string;
  showIcon?: boolean;
  onAction?: () => void;
}) {
  return (
    <form action={signOutAction} onSubmit={onAction}>
      <Button
        type="submit"
        size="sm"
        variant="outline"
        className={cn("text-xs sm:text-sm px-2.5 sm:px-3", className)}
      >
        {showIcon && <LogOut className="size-4" aria-hidden="true" />}
        <span>Logout</span>
      </Button>
    </form>
  );
}
