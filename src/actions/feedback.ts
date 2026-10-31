"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateFeedbackSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/get-current-user";
import { runAiStep } from "@/lib/ai-step";

// what every action returns to its form
export type ActionState = {
  success: boolean;
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export async function createFeedbackAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userData } = await getCurrentUser();
  if (!userData) return { success: false, message: "Please log in first." };

  const parsed = CreateFeedbackSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from("feedback")
    .insert({ ...parsed.data, user_id: userData.id }) // user_id is checked by RLS
    .select("id")
    .single();

  if (error || !created) {
    return {
      success: false,
      message: error?.message ?? "Could not save feedback.",
    };
  }

  // AI step: if anything fails, the post is already saved
  try {
    await runAiStep(
      created.id,
      userData.id,
      parsed.data.title,
      parsed.data.description,
    );
  } catch (e) {
    console.error("AI step failed:", e);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// soft delete: the row stays, it is only marked as deleted
export async function deleteFeedbackAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { isAdmin, userData } = await getCurrentUser();
  if (!userData) return { success: false, message: "Please log in first." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("feedback")
    .update({
      is_deleted: true,
      deleted_by_admin: isAdmin,
      deleted_at: new Date().toISOString(),
    })
    .eq("id", String(formData.get("id")));

  if (error) return { success: false, message: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}

// vote toggle: already voted -> remove vote, else add vote
export async function toggleVoteAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userData } = await getCurrentUser();
  if (!userData) redirect("/auth/login");

  const feedbackId = String(formData.get("feedback_id"));
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("vote")
    .select("id")
    .eq("user_id", userData.id)
    .eq("feedback_id", feedbackId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("vote").delete().eq("id", existing.id)
    : await supabase
        .from("vote")
        .insert({ feedback_id: feedbackId, user_id: userData.id });

  if (error) return { success: false, message: error.message };

  revalidatePath("/", "layout"); // refresh every page that shows vote counts
  return { success: true };
}
