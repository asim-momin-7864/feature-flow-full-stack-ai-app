import { supabaseAdmin } from "@/lib/supabase/admin";
import { embedText, triageText, feedbackText, EMBEDDING_MODEL } from "@/lib/ai";

const AI_DAILY_POST_LIMIT = 5;
type Admin = typeof supabaseAdmin;

export async function runAiStep(
  feedbackId: string,
  userId: string,
  title: string,
  description: string,
) {
  // daily cap: count this user's posts in the last 24 hours (includes the new one)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("feedback")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if ((count ?? 0) > AI_DAILY_POST_LIMIT) return; // over the cap: save the post without AI

  // run both in parallel; one failing does not stop the other
  await Promise.allSettled([
    saveEmbedding(supabaseAdmin, feedbackId, title, description),
    saveTriage(supabaseAdmin, feedbackId, title, description),
  ]);
}

async function saveEmbedding(
  admin: Admin,
  id: string,
  title: string,
  description: string,
) {
  try {
    const vector = await embedText(feedbackText(title, description));
    const { error } = await admin.from("feedback_embeddings").upsert({
      feedback_id: id,
      embedding: JSON.stringify(vector), // pgvector reads "[0.1,0.2,...]"
      model: EMBEDDING_MODEL,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("embedding failed:", e);
  }
}

async function saveTriage(
  admin: Admin,
  id: string,
  title: string,
  description: string,
) {
  try {
    const result = await triageText(title, description);
    const { error } = await admin
      .from("feedback")
      .update({
        tags: result.tags,
        ai_flagged: result.is_spam,
        ai_flag_reason: result.is_spam ? result.reason : null,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("triage failed:", e);
  }
}
