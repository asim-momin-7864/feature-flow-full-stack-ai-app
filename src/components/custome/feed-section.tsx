// section for feed

import { PAGE_SIZE, parseFeedParams } from "@/lib/feed-params";
import { getFeed, getMyVotedIds } from "@/lib/feed-queries";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FeedbackCard } from "./feedback-card";
import { FilterBar } from "./filter-bar";
import { Pager } from "./pager";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function FeedSection({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = parseFeedParams(await searchParams);

  const { items, total } = await getFeed(params);
  const votedIds = await getMyVotedIds();
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const isFiltered =
    Boolean(params.q) || params.category !== "ALL" || params.sort !== "newest";

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      <FilterBar params={params} />

      {/* Result count when filtered */}
      {isFiltered && total > 0 && (
        <p className="text-sm text-muted-foreground">
          Found {total} {total === 1 ? "result" : "results"}
        </p>
      )}

      {/* Feedback list or empty state */}
      {items.length === 0 ? (
        <div className="w-full text-center py-12 px-4 border border-dashed rounded-xl bg-muted/20">
          <p className="text-sm text-muted-foreground">
            {isFiltered
              ? "No feedback matches your search. Try different filters."
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
        <div className="flex flex-col gap-3 sm:gap-4">
          {items.map((item) => (
            <FeedbackCard
              key={item.id}
              feedbackData={item}
              isVoted={votedIds.includes(item.id)}
            />
          ))}
        </div>
      )}

      <Pager params={params} totalPages={totalPages} />
    </div>
  );
}
