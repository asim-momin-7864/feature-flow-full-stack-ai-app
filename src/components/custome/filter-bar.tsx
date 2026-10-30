import Link from "next/link";
import type { FeedParams } from "@/lib/feed-params";
import { Button } from "@/components/ui/button";

const selectClass =
  "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none sm:flex-1";

export function FilterBar({ params }: { params: FeedParams }) {
  return (
    <form
      key={`${params.q}|${params.category}|${params.sort}`}
      action="/"
      method="get"
      className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3"
    >
      <input
        name="q"
        defaultValue={params.q}
        placeholder="Search feedback..."
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          name="category"
          defaultValue={params.category === "ALL" ? "" : params.category}
          className={selectClass}
        >
          <option value="">All Categories</option>
          <option value="FEATURE">Feature</option>
          <option value="BUG">Bug</option>
          <option value="UI">UI</option>
        </select>

        <select name="sort" defaultValue={params.sort} className={selectClass}>
          <option value="newest">Newest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>

        <div className="flex items-center gap-2">
          <Button type="submit" className="h-10 flex-1 sm:flex-none">
            Search
          </Button>
          <Link
            href="/"
            className="flex h-10 items-center rounded-md px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Clear
          </Link>
        </div>
      </div>
    </form>
  );
}
