import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { embedText, feedbackText, EMBEDDING_MODEL } from "@/lib/ai";

export async function GET() {
  await requireAdmin();

  const { data: posts } = await supabaseAdmin
    .from("feedback")
    .select("id, title, description")
    .eq("is_deleted", false);
  const { data: done } = await supabaseAdmin
    .from("feedback_embeddings")
    .select("feedback_id");

  const doneIds = new Set((done ?? []).map((row) => row.feedback_id));
  const todo = (posts ?? []).filter((p) => !doneIds.has(p.id));

  let embedded = 0;
  let failed = 0;
  for (const post of todo) {
    try {
      const vector = await embedText(
        feedbackText(post.title, post.description),
      );
      const { error } = await supabaseAdmin.from("feedback_embeddings").upsert({
        feedback_id: post.id,
        embedding: JSON.stringify(vector),
        model: EMBEDDING_MODEL,
      });
      if (error) throw new Error(error.message);
      embedded++;
    } catch (e) {
      console.error("embed failed for", post.id, e);
      failed++;
    }
  }

  return NextResponse.json({ embedded, failed, skipped: doneIds.size });
}
