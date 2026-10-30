// it is server component

import { FeedSection } from "@/components/custome/feed-section";
import TrendingSidebar from "@/components/custome/trending-ideas";
import { FeedSkeleton, SidebarSkeleton } from "@/components/ui/feed-skeleton";
import { Suspense } from "react";

type SearchParamsPromise = Promise<Record<string, string | string[] | undefined>>;

export default function HomePage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  return (
    <main className="w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Feed */}
        <section className="flex-1 min-w-0 w-full flex flex-col gap-5 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Feedback Board
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Vote on features or submit your own ideas!
            </p>
          </div>

          <Suspense fallback={<FeedSkeleton />}>
            <FeedSection searchParams={searchParams} />
          </Suspense>
        </section>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-20">
            <Suspense fallback={<SidebarSkeleton />}>
              <TrendingSidebar />
            </Suspense>
          </div>
        </aside>
      </div>
    </main>
  );
}
