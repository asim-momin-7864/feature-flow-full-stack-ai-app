import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { createClient } from "@/lib/supabase/server";
import { dismissFlagAction, restoreFeedbackAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/constants";

export default async function AdminPage() {
  await requireAdmin();

  const supabase = await createClient();
  const [flaggedRes, deletedRes] = await Promise.all([
    supabase
      .from("feedback")
      .select("id, title, ai_flag_reason")
      .eq("ai_flagged", true)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false }),
    supabase
      .from("feedback")
      .select("id, title, deleted_by_admin, deleted_at")
      .eq("is_deleted", true)
      .order("deleted_at", { ascending: false }),
  ]);

  const error = flaggedRes.error || deletedRes.error;
  if (error) throw new Error(error.message);

  const flagged = flaggedRes.data ?? [];
  const deleted = deletedRes.data ?? [];

  return (
    <main className="mx-auto w-full max-w-3xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">Admin</h1>

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
            <div className="min-w-0">
              <Link
                href={`/feedback/${item.id}`}
                className="break-words font-medium hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                {item.ai_flag_reason || "No reason given"}
              </p>
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
