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
    <main className="min-h-screen flex justify-center w-full">
      <div className="w-full max-w-5xl px-3 sm:px-6 py-6 sm:py-8 lg:py-10 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* Main Feed Column */}
        <section className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0 w-full">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
              Feedback Board
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Vote on features or submit your own ideas to help shape our product!
            </p>
          </div>

          <Suspense fallback={<FeedSkeleton />}>
            <FeedSection searchParams={searchParams} />
          </Suspense>
        </section>

        {/* Sidebar Column */}
        <aside className="w-full lg:w-80 shrink-0">
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
