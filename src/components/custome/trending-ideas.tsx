import { createClient } from "@/lib/supabase/server";
import { TrendingFeedbackType } from "@/lib/validations";
import { ArrowUp, TrendingUp } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "./user-avatar";

export default async function TrendingSidebar() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_feedback_details")
    .select("id, title, vote_count, is_deleted, deleted_at, profile")
    .eq("is_deleted", false)
    .order("vote_count", { ascending: false })
    .limit(5);

  if (error) {
    console.error("TrendingSidebar error:", error.message);
    return null;
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center gap-2 font-semibold">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h2 className="text-sm sm:text-base">Trending Ideas</h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map((feedback: TrendingFeedbackType) => (
          <Link
            href={`/feedback/${feedback.id}`}
            key={feedback.id}
            className="flex flex-col gap-2 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
          >
            <h3 className="text-xs sm:text-sm font-medium line-clamp-2">
              {feedback.title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="relative h-5 w-5 shrink-0 rounded-full overflow-hidden border bg-muted text-[10px] font-bold flex items-center justify-center">
                  <UserAvatar
                    url={feedback.profile?.avatar_url}
                    fallbackText={feedback.profile?.full_name?.charAt(0) || "U"}
                  />
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-[120px]">
                  {feedback.profile?.full_name || "Anonymous"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                <ArrowUp className="w-3 h-3 text-primary" />
                <span>{feedback.vote_count ?? 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
