// section for feed

import { PAGE_SIZE, parseFeedParams } from "@/lib/feed-params";
import { getFeed, getMyVotedIds } from "@/lib/feed-queries";
import Link from "next/link";
import { SearchX } from "lucide-react";
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
      {/* Search & Filter Controls */}
      <FilterBar params={params} />

      {/* Results Header or Count when filtered */}
      {isFiltered && total > 0 && (
        <div className="flex items-center justify-between px-1 text-xs text-muted-foreground font-medium">
          <span>
            Found <span className="text-foreground font-semibold">{total}</span>{" "}
            {total === 1 ? "result" : "results"}
          </span>
          <Link
            href="/"
            className="text-xs text-primary hover:underline underline-offset-4"
          >
            Clear filters
          </Link>
        </div>
      )}

      {/* Main Feedback List or Empty State */}
      {items.length === 0 ? (
        <div className="w-full text-center py-12 px-6 border border-dashed border-border/80 rounded-2xl bg-card/40 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <SearchX className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm sm:text-base text-foreground">
              No feedback found
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
              {isFiltered
                ? "We couldn't find anything matching your search or filters. Try adjusting your search query or reset filters."
                : "No feedback has been submitted yet. Be the first to share an idea!"}
            </p>
          </div>
          {isFiltered && (
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "mt-1 rounded-xl text-xs",
              })}
            >
              Reset Filters
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4 w-full">
          {items.map((item) => (
            <FeedbackCard
              key={item.id}
              feedbackData={item}
              isVoted={votedIds.includes(item.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pager params={params} totalPages={totalPages} />
    </div>
  );
}
