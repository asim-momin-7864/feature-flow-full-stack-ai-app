import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Upvote from "@/components/custome/upvote";
import { ProfileAvatar } from "@/components/custome/profile-avatar";
import { formatDate, getCategoryVariant } from "@/lib/constants";
import type { FeedbackType } from "@/lib/validations";

export function FeedbackCard({
  feedbackData,
  isVoted = false,
}: {
  feedbackData: FeedbackType;
  isVoted?: boolean;
}) {
  const name = feedbackData.profile?.full_name || "Anonymous";

  return (
    <Card className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/40 sm:p-5">
      <Link href={`/feedback/${feedbackData.id}`} className="block space-y-3">
        {/* author + category */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ProfileAvatar
              url={feedbackData.profile?.avatar_url}
              name={name}
              className="h-7 w-7"
            />
            <p className="min-w-0 truncate text-xs text-muted-foreground sm:text-sm">
              <span className="font-medium text-foreground">{name}</span>
              {" · "}
              {formatDate(feedbackData.created_at)}
            </p>
          </div>
          <Badge
            variant={getCategoryVariant(feedbackData.category)}
            className="shrink-0"
          >
            {feedbackData.category}
          </Badge>
        </div>

        {/* title + description */}
        <div className="space-y-1">
          <h2 className="break-words text-base font-semibold leading-snug sm:text-lg">
            {feedbackData.title}
          </h2>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {feedbackData.description}
          </p>
        </div>
      </Link>

      {/* actions */}
      <div className="flex items-center gap-4">
        <Upvote
          feedbackId={feedbackData.id}
          voteCount={feedbackData.vote_count ?? 0}
          isVoted={isVoted}
        />
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          {feedbackData.comment_count ?? 0}
        </span>
      </div>
    </Card>
  );
}
