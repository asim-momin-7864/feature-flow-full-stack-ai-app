"use client";
import { createCommentAction } from "@/actions/comment";
import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CommentForm = ({ feedback_id }: { feedback_id: string }) => {
  // state
  const [state, formAction, isPending] = useActionState(createCommentAction, {
    success: false,
    message: "",
  });
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
        <CardTitle className="text-base sm:text-lg font-bold">Leave a comment</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="feedback_id" value={feedback_id} />
        <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
          <div className="space-y-3 sm:space-y-4">
            <Textarea
              placeholder="Share your thoughts or suggest an idea..."
              className="min-h-24 sm:min-h-28 text-xs sm:text-sm resize-y"
              name="content"
              required
            />
            {state && !state.success && state.message && (
              <p className="text-destructive text-xs sm:text-sm font-medium">
                {state.message}
              </p>
            )}
            <Button type="submit" disabled={isPending} className="w-full font-semibold text-xs sm:text-sm">
              {isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export default CommentForm;
