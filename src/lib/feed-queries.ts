import { createClient } from "./supabase/server";
import type { FeedParams } from "./feed-params";

const FEED_LIMIT = 20;

export async function getFeed(params: FeedParams) {
  const supabase = await createClient();

  let query = supabase
    .from("vw_feedback_details")
    .select("*")
    .eq("is_deleted", false);

  if (params.category !== "ALL") {
    query = query.eq("category", params.category);
  }

  if (params.q) {
    query = query.ilike("title", `%${params.q}%`);
  }

  if (params.sort === "upvotes") {
    query = query
      .order("vote_count", { ascending: false })
      .order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query.limit(FEED_LIMIT);
  if (error) throw new Error(error.message);

  return data ?? [];
}

// ids of posts the logged-in user has voted on (one query, not one per card)
export async function getMyVotedIds(): Promise<string[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("vote")
    .select("feedback_id")
    .eq("user_id", user.id);

  return (data ?? []).map((row) => row.feedback_id);
}
