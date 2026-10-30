"use client";

import { useActionState } from "react";
import { createCommentAction } from "@/actions/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CommentForm({ feedback_id }: { feedback_id: string }) {
  const [state, formAction, isPending] = useActionState(createCommentAction, {
    success: false,
  });

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="feedback_id" value={feedback_id} />
      <Textarea
        name="content"
        placeholder="Share your thoughts..."
        className="min-h-28 text-base sm:text-sm"
        maxLength={1000}
        required
      />
      {state.errors?.content && (
        <p className="text-sm text-destructive">{state.errors.content[0]}</p>
      )}
      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button
        type="submit"
        disabled={isPending}
        className="h-10 w-full sm:w-auto"
      >
        {isPending ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
