import { createClient } from "./supabase/server";
import { PAGE_SIZE, type FeedParams } from "./feed-params";

export async function getFeed(params: FeedParams) {
  const supabase = await createClient();

  const from = (params.page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // make DB query and store in var
  let query = supabase
    .from("vw_feedback_details")
    .select("*", {
      count: "exact",
    })
    .eq("is_deleted", false);

  // conditonal adding more query
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

  // fetch
  const { data, count, error } = await query.range(from, to);

  if (error) throw new Error(error.message);

  // return
  return { items: data ?? [], total: count ?? 0 };
}

// one user fetching all users vote (N+1 problem fix)
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

  // return
  return (data ?? []).map((row) => row.feedback_id);
}
