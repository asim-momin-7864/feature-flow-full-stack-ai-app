"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/get-current-user";
import type { ActionState } from "@/actions/feedback";
import { CreateCommentSchema } from "@/lib/validations";

export async function createCommentAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userData } = await getCurrentUser();
  if (!userData) return { success: false, message: "Please log in first." };
  const parsed = CreateCommentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comment").insert({
    content: parsed.data.content,
    user_id: userData.id, // checked by RLS
    feedback_id: String(formData.get("feedback_id")),
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/", "layout"); // comment count also shows on the feed
  return { success: true };
}

// soft delete: the row stays, it is only marked as deleted
export async function deleteCommentAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { isAdmin, userData } = await getCurrentUser();
  if (!userData) return { success: false, message: "Please log in first." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("comment")
    .update({
      is_deleted: true,
      deleted_by_admin: isAdmin,
      deleted_at: new Date().toISOString(),
    })
    .eq("id", String(formData.get("comment_id")));

  if (error) return { success: false, message: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
