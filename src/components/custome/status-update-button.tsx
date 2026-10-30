"use client";

import { useActionState } from "react";
import { updateStatusAdminAction } from "@/actions/admin";
import type { statusEnumType } from "@/lib/validations";

const STATUSES = [
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export default function StatusUpdateButton({
  feedback_id,
  currentState,
}: {
  feedback_id: string;
  currentState: statusEnumType;
}) {
  const [state, formAction, isPending] = useActionState(
    updateStatusAdminAction,
    {
      success: false,
    },
  );

  return (
    <form action={formAction} className="w-full sm:w-52">
      <input type="hidden" name="feedback_id" value={feedback_id} />
      <select
        name="status"
        defaultValue={currentState}
        disabled={isPending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm font-medium shadow-sm"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {isPending && (
        <p className="mt-1 text-xs text-muted-foreground">Saving...</p>
      )}
      {state.message && !state.success && (
        <p className="mt-1 text-xs text-destructive">{state.message}</p>
      )}
    </form>
  );
}
