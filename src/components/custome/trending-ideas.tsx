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

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex flex-col gap-2.5 p-4 rounded-2xl border border-dashed border-border/80 bg-muted/20 text-center">
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">No trending ideas yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center gap-2 text-foreground font-semibold px-1">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h2 className="text-sm sm:text-base font-semibold">Trending Ideas</h2>
      </div>

      <div className="flex flex-col gap-2.5 sm:gap-3">
        {data.map((feedback: TrendingFeedbackType) => (
          <Link
            href={`/feedback/${feedback.id}`}
            key={feedback.id}
            className="group flex flex-col gap-2 p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card shadow-xs hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <h3 className="font-medium text-xs sm:text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {feedback.title}
            </h3>

            <div className="flex items-center justify-between mt-0.5">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="h-5 w-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase overflow-hidden border border-border/50 relative">
                  <UserAvatar
                    url={feedback.profile?.avatar_url}
                    fallbackText={feedback.profile?.full_name?.charAt(0) || "U"}
                  />
                </div>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate max-w-[100px] sm:max-w-[120px]">
                  {feedback.profile?.full_name || "Anonymous"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 border border-border/40">
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
