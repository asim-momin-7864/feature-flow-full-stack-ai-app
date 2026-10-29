// src/app/loading.tsx
import { FeedSkeleton, SidebarSkeleton } from "@/components/ui/feed-skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen flex justify-center w-full">
      <div className="w-full max-w-5xl px-3 sm:px-6 py-6 sm:py-8 lg:py-10 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        <section className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0 w-full">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-muted/60 rounded-md animate-pulse" />
          </div>
          <FeedSkeleton />
        </section>
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-20">
            <SidebarSkeleton />
          </div>
        </aside>
      </div>
    </main>
  );
}
