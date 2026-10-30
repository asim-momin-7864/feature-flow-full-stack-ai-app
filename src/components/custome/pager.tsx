// pager
import { FeedParams } from "@/lib/feed-params";
import Link from "next/link";
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
    <nav className="flex items-center justify-center gap-4 pt-4 pb-2">
      {hasPrev ? (
        <Link
          href={pageLink(params, params.page - 1)}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Previous
        </Link>
      ) : (
        <span className={buttonVariants({ variant: "outline", size: "sm" }) + " opacity-40 cursor-not-allowed"}>
          Previous
        </span>
      )}

      <span className="text-sm text-muted-foreground">
        Page {params.page} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={pageLink(params, params.page + 1)}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Next
        </Link>
      ) : (
        <span className={buttonVariants({ variant: "outline", size: "sm" }) + " opacity-40 cursor-not-allowed"}>
          Next
        </span>
      )}
    </nav>
  );
}
