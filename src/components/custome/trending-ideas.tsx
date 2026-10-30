import Link from "next/link";
import { ArrowUp, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function TrendingSidebar() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vw_feedback_details")
    .select("id, title, vote_count")
    .eq("is_deleted", false)
    .order("vote_count", { ascending: false })
    .limit(5);

  if (!data || data.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 font-semibold">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h2>Trending Ideas</h2>
      </div>

      {data.map((item) => (
        <Link
          key={item.id}
          href={`/feedback/${item.id}`}
          className="flex items-center justify-between gap-2 p-3 rounded-xl border bg-card hover:bg-muted/30"
        >
          <span className="text-sm line-clamp-2">{item.title}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <ArrowUp className="w-3 h-3 text-primary" />
            {item.vote_count ?? 0}
          </span>
        </Link>
      ))}
    </div>
  );
}
