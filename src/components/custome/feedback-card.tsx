// maybe we need to make it client component as we add upvote interactivity
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import type { FeedbackType } from "@/lib/validations";
import { UserAvatar } from "@/components/custome/user-avatar";
import Upvote from "@/components/custome/upvote";
import { createClient } from "@/lib/supabase/server";
import { hasUserVoted } from "@/lib/queries";
import Link from "next/link";

// feedback card props
export type FeedbackCardProps = {
  feedbackData: FeedbackType;
  isVoted?: boolean;
  variant?: "default" | "compact";
};

// color helper
export const getCategoryStyles = (category: string) => {
  switch (category?.toUpperCase()) {
    case "BUG":
      return {
        badge:
          "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border-transparent hover:bg-red-100 dark:hover:bg-red-500/20",
        cardBg:
          "bg-red-50/50 dark:bg-red-950/10 hover:bg-red-100/50 dark:hover:bg-red-950/20 border-red-100/50 dark:border-red-900/30",
      };
    case "UI":
      return {
        badge:
          "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-transparent hover:bg-blue-100 dark:hover:bg-blue-500/20",
        cardBg:
          "bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-100/50 dark:hover:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30",
      };
    case "FEATURE":
    default:
      return {
        badge:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-transparent hover:bg-emerald-100 dark:hover:bg-emerald-500/20",
        cardBg:
          "bg-emerald-50/50 dark:bg-emerald-950/10 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30",
      };
  }
};

export async function FeedbackCard({
  feedbackData,
  isVoted = false,
  variant = "default",
}: FeedbackCardProps) {
  const styles = getCategoryStyles(feedbackData.category);

  const isCompact = variant === "compact";

  return (
    <Card
      className={`transition-colors shadow-sm ${styles.cardBg} ${isCompact ? "overflow-hidden" : ""}`}
    >
      <Link href={`/feedback/${feedbackData.id}`} className="block group">
        <CardHeader
          className={`${isCompact ? "p-3.5 pb-2 sm:p-4 sm:pb-3" : "p-4 sm:p-6 pb-2 sm:pb-3"} group-hover:opacity-80 transition-opacity`}
        >
          <div className="flex justify-between items-start gap-2 sm:gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle
                className={
                  isCompact
                    ? "text-sm font-semibold leading-snug break-words"
                    : "text-base sm:text-lg md:text-xl font-bold leading-snug break-words"
                }
              >
                {feedbackData.title}
              </CardTitle>
              <CardDescription
                className={
                  isCompact
                    ? "line-clamp-2 text-xs opacity-80 break-words"
                    : "line-clamp-2 text-xs sm:text-sm break-words"
                }
              >
                {feedbackData.description}
              </CardDescription>
            </div>
            {!isCompact && (
              <Badge
                variant="outline"
                className={`${styles.badge} shrink-0 text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1`}
              >
                {feedbackData.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        {!isCompact && (
          <CardContent className="px-4 sm:px-6 pb-3 group-hover:opacity-80 transition-opacity">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <div className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 rounded-full overflow-hidden border bg-muted">
                <UserAvatar
                  url={feedbackData.profile?.avatar_url}
                  fallbackText={
                    feedbackData.profile?.full_name?.charAt(0) || "U"
                  }
                />
              </div>
              <span className="font-medium text-foreground/80 truncate max-w-[120px] sm:max-w-none">
                {feedbackData.profile?.full_name || "Anonymous"}
              </span>
              <span>•</span>
              <span className="text-[11px] sm:text-xs">
                {new Date(feedbackData.created_at).toDateString()}
              </span>
            </div>
          </CardContent>
        )}
      </Link>
      <CardFooter
        className={
          isCompact
            ? "p-3.5 pt-0 sm:p-4 sm:pt-0"
            : "px-4 sm:px-6 pb-4 sm:pb-5 pt-0"
        }
      >
        <div
          className={`flex items-center w-full ${isCompact ? "justify-between" : "gap-3 sm:gap-4"}`}
        >
          <Upvote feedbackData={feedbackData} isVoted={isVoted} />

          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            {isCompact && (
              <div className="h-5 w-5 shrink-0 rounded-full overflow-hidden border bg-muted">
                <UserAvatar
                  url={feedbackData.profile?.avatar_url}
                  fallbackText={
                    feedbackData.profile?.full_name?.charAt(0) || "U"
                  }
                />
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <MessageSquare
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                suppressHydrationWarning
              />
              <span>
                {feedbackData.comment_count ??
                  (feedbackData.comment as [{ count: number }])?.[0]?.count ??
                  0}
                {!isCompact && " replies"}
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
