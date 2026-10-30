"use client";

import { useActionState } from "react";
import { deleteFeedbackAction } from "@/actions/feedback";
import { Button } from "@/components/ui/button";

export default function DeleteButton({ id }: { id: string }) {
  const [, formAction, isPending] = useActionState(deleteFeedbackAction, {
    success: false,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        disabled={isPending}
        variant="destructive"
        size="sm"
      >
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  );
}
