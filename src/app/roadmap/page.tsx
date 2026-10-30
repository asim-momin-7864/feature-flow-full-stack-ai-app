import { FeedbackCard } from "@/components/custome/feedback-card";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackType } from "@/lib/validations";
import { Suspense } from "react";

// The 4 columns
const statuses = [
  { id: "UNDER_REVIEW", label: "Under Review", color: "bg-orange-500" },
  { id: "PLANNED", label: "Planned", color: "bg-blue-500" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-purple-500" },
  { id: "COMPLETED", label: "Completed", color: "bg-emerald-500" },
];

async function RoadmapBoard() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_feedback_details")
    .select("*")
    .order("created_at", { ascending: false });

  const feedbacksArray = data as unknown as FeedbackType[];

  if (!feedbacksArray || error) {
    return (
      <p className="text-destructive text-center py-10">
        Error loading roadmap.
      </p>
    );
  }

  // Filter out deleted feedback so they don't show on the roadmap
  const activeFeedbacks = feedbacksArray.filter(
    (f) => !f.is_deleted && !f.deleted_at,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 w-full items-start">
      {statuses.map((statusObj) => {
        const columnFeedbacks = activeFeedbacks.filter(
          (f) => f.status === statusObj.id,
        );

        return (
          <div
            key={statusObj.id}
            className="flex flex-col gap-3 sm:gap-4 bg-muted/30 p-3.5 sm:p-4 rounded-xl border"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${statusObj.color}`} />
              <h2 className="font-semibold text-sm">
                {statusObj.label}
              </h2>
              <span className="text-muted-foreground text-xs ml-auto">
                {columnFeedbacks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              {columnFeedbacks.length === 0 ? (
                <div className="p-4 border border-dashed rounded-lg text-muted-foreground text-center text-sm">
                  No feedback in this stage.
                </div>
              ) : (
                columnFeedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedbackData={feedback}
                    variant="compact"
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:p-8 flex flex-col gap-6 sm:gap-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Roadmap
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              See what we are currently working on and what's coming next.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
                <div className="h-64 rounded-xl bg-muted animate-pulse" />
                <div className="h-64 rounded-xl bg-muted animate-pulse" />
                <div className="h-64 rounded-xl bg-muted animate-pulse" />
                <div className="h-64 rounded-xl bg-muted animate-pulse" />
              </div>
            }
          >
            <RoadmapBoard />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
