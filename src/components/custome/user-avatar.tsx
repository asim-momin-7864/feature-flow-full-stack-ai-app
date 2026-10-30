"use client";

import { useState } from "react";

export function UserAvatar({
  url,
  fallbackText,
  className = "",
}: {
  url?: string | null;
  fallbackText: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (url && !hasError) {
    return (
      <img
        src={url}
        alt="Avatar"
        className={`w-full h-full object-cover ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <span className={`flex items-center justify-center w-full h-full text-[10px] font-bold uppercase text-foreground ${className}`}>
      {fallbackText}
    </span>
  );
}
