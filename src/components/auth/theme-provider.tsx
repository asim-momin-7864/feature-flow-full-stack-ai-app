"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// React 19 emits a development error when a component renders an inline script tag.
// In next-themes, this script is intentional to prevent theme flashing (FOUC).
// We suppress this specific false-positive warning in development.
if (
  process.env.NODE_ENV === "development" &&
  !(console.error as { __scriptTagWarningPatched?: boolean }).__scriptTagWarningPatched
) {
  const originalError = console.error;
  const patchedError = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
  (patchedError as { __scriptTagWarningPatched?: boolean }).__scriptTagWarningPatched = true;
  console.error = patchedError;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

