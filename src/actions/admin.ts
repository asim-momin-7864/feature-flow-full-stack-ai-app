"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/require-admin";
import { statusEnum } from "@/lib/validations";
import type { ActionState } from "@/actions/feedback";

// change the status of a post (dropdown on the post page)
export async function updateStatusAdminAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const status = statusEnum.safeParse(formData.get("status"));
  if (!status.success) return { success: false, message: "Invalid status" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("feedback")
    .update({ status: status.data })
    .eq("id", String(formData.get("feedback_id")));

  if (error) return { success: false, message: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

// admin page: clear the AI flag on a post
export async function dismissFlagAction(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("feedback")
    .update({ ai_flagged: false })
    .eq("id", String(formData.get("id")));

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

// admin page: bring a soft-deleted post back
export async function restoreFeedbackAction(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("feedback")
    .update({ is_deleted: false, deleted_by_admin: false, deleted_at: null })
    .eq("id", String(formData.get("id")));

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
