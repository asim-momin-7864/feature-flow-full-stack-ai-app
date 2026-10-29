"use client";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" size="sm" variant="outline" className="text-xs sm:text-sm px-2.5 sm:px-3">
        Logout
      </Button>
    </form>
  );
}
