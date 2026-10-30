"use client";

import { ArrowBigUp, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { toggleVoteAction } from "@/actions/feedback";

export default function Upvote({
  feedbackId,
  voteCount,
  isVoted,
}: {
  feedbackId: string;
  voteCount: number;
  isVoted: boolean;
}) {
  const [, formAction, isPending] = useActionState(toggleVoteAction, {
    success: false,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="feedback_id" value={feedbackId} />
      <button
        type="submit"
        disabled={isPending}
        className={`flex h-9 items-center gap-1.5 rounded-full bg-primary/10 px-3 text-sm font-bold hover:bg-primary/20 ${
          isVoted ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowBigUp
            className="h-5 w-5"
            fill={isVoted ? "currentColor" : "none"}
          />
        )}
        {voteCount}
      </button>
    </form>
  );
}
