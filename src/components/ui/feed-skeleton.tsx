// src/components/ui/feed-skeleton.tsx
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      {[1, 2, 3].map((n) => (
        <Card key={n} className="animate-pulse">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
              <div className="h-6 w-16 rounded-full bg-muted shrink-0" />
            </div>
          </CardHeader>
          <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0 flex items-center gap-4">
            <div className="h-8 w-14 rounded-lg bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      <div className="flex flex-col gap-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-3 rounded-xl border bg-card animate-pulse space-y-2"
          >
            <div className="h-4 bg-muted rounded w-4/5" />
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-4 w-8 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
