import { createClient } from "@/lib/supabase/server";
import { getMyVotedIds } from "@/lib/feed-queries";
import { FeedbackCard } from "@/components/custome/feedback-card";
import type { FeedbackType } from "@/lib/validations";

const STATUSES = [
  { id: "UNDER_REVIEW", label: "Under Review", color: "bg-orange-500" },
  { id: "PLANNED", label: "Planned", color: "bg-blue-500" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-purple-500" },
  { id: "COMPLETED", label: "Completed", color: "bg-emerald-500" },
];

export default async function RoadmapPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_feedback_details")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  const items = (data ?? []) as unknown as FeedbackType[];
  const votedIds = await getMyVotedIds();

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Roadmap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          See what we are working on and what is coming next.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {STATUSES.map((status) => {
          const column = items.filter((item) => item.status === status.id);

          return (
            <section
              key={status.id}
              className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3 sm:p-4"
            >
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${status.color}`} />
                <h2 className="text-base font-semibold">{status.label}</h2>
                <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                  {column.length}
                </span>
              </div>

              {column.length === 0 ? (
                <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Nothing here yet.
                </p>
              ) : (
                column.map((item) => (
                  <FeedbackCard
                    key={item.id}
                    feedbackData={item}
                    isVoted={votedIds.includes(item.id)}
                  />
                ))
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
