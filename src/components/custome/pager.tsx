// pager
import { FeedParams } from "@/lib/feed-params";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

function pageLink(params: FeedParams, page: number) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category !== "ALL") search.set("category", params.category);
  if (params.sort !== "newest") search.set("sort", params.sort);
  if (page > 1) search.set("page", String(page));
  const queryString = search.toString();
  return queryString ? `/?${queryString}` : "/";
}

export function Pager({
  params,
  totalPages,
}: {
  params: FeedParams;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hasPrev = params.page > 1;
  const hasNext = params.page < totalPages;

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 pt-4 sm:pt-6 pb-2"
    >
      {hasPrev ? (
        <Link
          href={pageLink(params, params.page - 1)}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "h-8 px-2.5 sm:px-3 text-xs sm:text-sm rounded-xl gap-1",
          })}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <span
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className:
              "h-8 px-2.5 sm:px-3 text-xs sm:text-sm rounded-xl gap-1 opacity-40 cursor-not-allowed pointer-events-none",
          })}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </span>
      )}

      <div className="text-xs sm:text-sm font-medium text-muted-foreground px-3 py-1 rounded-xl bg-muted/40 border border-border/50">
        Page <span className="text-foreground font-semibold">{params.page}</span> of{" "}
        <span className="text-foreground font-semibold">{totalPages}</span>
      </div>

      {hasNext ? (
        <Link
          href={pageLink(params, params.page + 1)}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "h-8 px-2.5 sm:px-3 text-xs sm:text-sm rounded-xl gap-1",
          })}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className:
              "h-8 px-2.5 sm:px-3 text-xs sm:text-sm rounded-xl gap-1 opacity-40 cursor-not-allowed pointer-events-none",
          })}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
