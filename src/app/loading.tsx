// src/app/loading.tsx
import { FeedSkeleton, SidebarSkeleton } from "@/components/ui/feed-skeleton";

export default function Loading() {
  return (
    <main className="w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-8 items-start">
        <section className="flex-1 min-w-0 w-full flex flex-col gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
          <FeedSkeleton />
        </section>
        <aside className="w-full lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-20">
            <SidebarSkeleton />
          </div>
        </aside>
      </div>
    </main>
  );
}
