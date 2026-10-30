import { FeedSection } from "@/components/custome/feed-section";
import TrendingSidebar from "@/components/custome/trending-ideas";
import { parseFeedParams, type RawSearchParams } from "@/lib/feed-params";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = parseFeedParams(await searchParams);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:items-start">
      <section className="flex w-full min-w-0 flex-1 flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Feedback Board</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vote on features or submit your own ideas!
          </p>
        </div>
        <FeedSection params={params} />
      </section>

      <aside className="w-full lg:sticky lg:top-20 lg:w-80 lg:shrink-0">
        <TrendingSidebar />
      </aside>
    </main>
  );
}
