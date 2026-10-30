// filter bar
import Link from "next/link";
import type { FeedParams } from "@/lib/feed-params";
import { Button } from "@/components/ui/button";

export function FilterBar({ params }: { params: FeedParams }) {
  return (
    <form
      action="/"
      method="get"
      className="flex flex-col gap-2 p-2 rounded-xl border bg-muted/30"
    >
      {/* Search Input */}
      <input
        name="q"
        defaultValue={params.q}
        placeholder="Search feedback..."
        className="w-full h-9 px-3 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-ring/30"
      />

      {/* Selects row  */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Selects */}
        <div className="flex gap-2 flex-1">
          <select
            name="category"
            defaultValue={params.category === "ALL" ? "" : params.category}
            className="flex-1 h-9 rounded-lg border bg-background pl-3 pr-8 text-sm outline-none"
          >
            <option value="">All Categories</option>
            <option value="FEATURE">Feature</option>
            <option value="BUG">Bug</option>
            <option value="UI">UI</option>
          </select>

          <select
            name="sort"
            defaultValue={params.sort}
            className="flex-1 h-9 rounded-lg border bg-background pl-3 pr-8 text-sm outline-none"
          >
            <option value="newest">Newest</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" className="flex-1 sm:flex-none">
            Search
          </Button>
          <Link
            href="/"
            className="text-sm px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Clear
          </Link>
        </div>
      </div>
    </form>
  );
}
