// src/components/ui/feed-skeleton.tsx
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      {[1, 2, 3].map((n) => (
        <Card
          key={n}
          className="animate-pulse border-border/50 bg-card/60 overflow-hidden shadow-xs"
        >
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3 space-y-3">
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-5 bg-muted rounded-md w-3/4 sm:w-1/2" />
                <div className="h-4 bg-muted/70 rounded-md w-full" />
                <div className="h-4 bg-muted/50 rounded-md w-4/5 hidden sm:block" />
              </div>
              <div className="h-6 w-16 rounded-full bg-muted shrink-0" />
            </div>
          </CardHeader>
          <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-14 rounded-xl bg-muted" />
              <div className="h-4 w-16 rounded bg-muted/60" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-muted" />
              <div className="h-3 w-20 rounded bg-muted/60" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
        <div className="h-5 w-28 rounded bg-muted animate-pulse" />
      </div>
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-3 sm:p-3.5 rounded-xl border border-border/50 bg-card/60 animate-pulse space-y-2.5"
          >
            <div className="h-4 bg-muted rounded w-4/5" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-full bg-muted" />
                <div className="h-3 w-16 rounded bg-muted/60" />
              </div>
              <div className="h-4 w-8 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
