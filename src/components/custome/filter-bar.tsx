// filter bar
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { FeedParams } from "@/lib/feed-params";
import { Button, buttonVariants } from "@/components/ui/button";

export function FilterBar({ params }: { params: FeedParams }) {
  const hasActiveFilters =
    Boolean(params.q) || params.category !== "ALL" || params.sort !== "newest";

  return (
    <form
      action="/"
      method="get"
      className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-muted/40 border border-border/70 shadow-xs"
    >
      {/* Search Input with Icon */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search ideas, bugs, requests..."
          className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/60 bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 transition-[color,box-shadow] outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Filter Dropdowns & Actions */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <select
          name="category"
          defaultValue={params.category === "ALL" ? "" : params.category}
          className="h-9 rounded-xl border border-border/60 bg-background px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-foreground transition-[color,box-shadow] outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 hover:bg-muted/30 cursor-pointer"
        >
          <option value="">All Categories</option>
          <option value="FEATURE">Feature</option>
          <option value="BUG">Bug</option>
          <option value="UI">UI</option>
        </select>

        <select
          name="sort"
          defaultValue={params.sort}
          className="h-9 rounded-xl border border-border/60 bg-background px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-foreground transition-[color,box-shadow] outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 hover:bg-muted/30 cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>

        <Button
          type="submit"
          size="sm"
          className="h-9 px-3.5 rounded-xl font-medium shadow-xs"
        >
          Search
        </Button>

        {hasActiveFilters && (
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className:
                "h-9 px-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground gap-1",
            })}
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
