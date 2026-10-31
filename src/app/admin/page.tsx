import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { createClient } from "@/lib/supabase/server";
import { dismissFlagAction, restoreFeedbackAction } from "@/actions/admin";
import { formatDate } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CATEGORIES = ["FEATURE", "BUG", "UI"];

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold">{value ?? 0}</p>
    </Card>
  );
}

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();

  // count only, no rows (head: true), never counting deleted posts
  const countPosts = () =>
    supabase
      .from("feedback")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false);

  const [
    open,
    review,
    flaggedCount,
    completed,
    categoryRes,
    flaggedRes,
    deletedRes,
  ] = await Promise.all([
    countPosts().neq("status", "COMPLETED"),
    countPosts().eq("status", "UNDER_REVIEW"),
    countPosts().eq("ai_flagged", true),
    countPosts().eq("status", "COMPLETED"),
    supabase.from("feedback").select("category").eq("is_deleted", false),
    supabase
      .from("feedback")
      .select("id, title, tags, ai_flag_reason")
      .eq("ai_flagged", true)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false }),
    supabase
      .from("feedback")
      .select("id, title, deleted_by_admin, deleted_at")
      .eq("is_deleted", true)
      .order("deleted_at", { ascending: false }),
  ]);

  const error = [
    open,
    review,
    flaggedCount,
    completed,
    categoryRes,
    flaggedRes,
    deletedRes,
  ]
    .map((r) => r.error)
    .find(Boolean);
  if (error) throw new Error(error.message);

  const flagged = flaggedRes.data ?? [];
  const deleted = deletedRes.data ?? [];

  // posts per category, with a share (%) for the bar
  const categoryRows = categoryRes.data ?? [];
  const total = categoryRows.length;
  const byCategory = CATEGORIES.map((name) => {
    const count = categoryRows.filter((row) => row.category === name).length;
    return {
      name,
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
    };
  });

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Admin dashboard</h1>

      {/* stat cards */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Open posts" value={open.count} />
        <StatCard label="Awaiting review" value={review.count} />
        <StatCard label="Flagged by AI" value={flaggedCount.count} />
        <StatCard label="Completed" value={completed.count} />
      </section>

      {/* posts by category */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Posts by category</h2>
        <Card className="space-y-4 p-4">
          {byCategory.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">
                  {item.count} ({item.percent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* moderation: flagged by AI */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Flagged by AI ({flagged.length})
        </h2>
        {flagged.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing flagged.</p>
        )}
        {flagged.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <Link
                href={`/feedback/${item.id}`}
                className="break-words font-medium hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                {item.ai_flag_reason || "No reason given"}
              </p>
              {item.tags?.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Tags: {item.tags.join(", ")}
                </p>
              )}
            </div>
            <form action={dismissFlagAction}>
              <input type="hidden" name="id" value={item.id} />
              <Button
                type="submit"
                variant="outline"
                className="h-10 w-full sm:w-auto"
              >
                Dismiss
              </Button>
            </form>
          </div>
        ))}
      </section>

      {/* moderation: deleted posts */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Deleted posts ({deleted.length})
        </h2>
        {deleted.length === 0 && (
          <p className="text-sm text-muted-foreground">No deleted posts.</p>
        )}
        {deleted.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="break-words font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                Deleted by {item.deleted_by_admin ? "an admin" : "the author"}
                {item.deleted_at && ` on ${formatDate(item.deleted_at)}`}
              </p>
            </div>
            <form action={restoreFeedbackAction}>
              <input type="hidden" name="id" value={item.id} />
              <Button type="submit" className="h-10 w-full sm:w-auto">
                Restore
              </Button>
            </form>
          </div>
        ))}
      </section>
    </main>
  );
}
