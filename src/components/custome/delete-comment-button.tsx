"use client";

import { useActionState } from "react";
import { deleteCommentAction } from "@/actions/comment";
import { Button } from "../ui/button";

const DeleteCommentButton = ({ commentId, feedbackId }: { commentId: string, feedbackId: string }) => {
  // server action
  const [, formAction, isPending] = useActionState(deleteCommentAction, {
    success: false,
    message: "",
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="comment_id" value={commentId} />
      <input type="hidden" name="feedback_id" value={feedbackId} />
      <Button
        type="submit"
        disabled={isPending}
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs h-8 px-2"
      >
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  );
};

export default DeleteCommentButton;
