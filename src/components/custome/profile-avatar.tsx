import { UserAvatar } from "@/components/custome/user-avatar";

export function ProfileAvatar({
  url,
  name,
  className = "h-8 w-8",
}: {
  url?: string | null;
  name?: string | null;
  className?: string; // size, e.g. "h-10 w-10"
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border bg-muted ${className}`}
    >
      <UserAvatar url={url} fallbackText={name?.charAt(0) || "U"} />
    </div>
  );
}
