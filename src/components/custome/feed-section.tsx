import Link from "next/link";
import type { FeedParams } from "@/lib/feed-params";
import { getFeed, getMyVotedIds } from "@/lib/feed-queries";
import { buttonVariants } from "@/components/ui/button";
import { FeedbackCard } from "./feedback-card";
import { FilterBar } from "./filter-bar";

export async function FeedSection({ params }: { params: FeedParams }) {
  const items = await getFeed(params);
  const votedIds = await getMyVotedIds();

  const isFiltered =
    Boolean(params.q) || params.category !== "ALL" || params.sort !== "newest";

  return (
    <div className="flex flex-col gap-4 w-full">
      <FilterBar params={params} />

      {items.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed rounded-xl">
          <p className="text-sm text-muted-foreground">
            {isFiltered
              ? "No feedback matches your search."
              : "No feedback yet. Be the first to submit an idea!"}
          </p>
          {isFiltered && (
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "mt-4",
              })}
            >
              Reset Filters
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <FeedbackCard
              key={item.id}
              feedbackData={item}
              isVoted={votedIds.includes(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
