// function to validate user generated URL

import { z } from "zod";

export const PAGE_SIZE = 10;

const CATEGORY_OPITIONS = ["ALL", "FEATURE", "BUG", "UI"] as const;
const SORT_OPTIONS = ["newest", "upvotes"] as const;

// makes search text safer
function cleanSearchText(text: string): string {
  return text
    .trim()
    .slice(0, 100)
    .replaceAll("%", "")
    .replaceAll("_", "")
    .replaceAll("\\", "")
    .trim();
}

const feedParamsSchema = z.object({
  category: z.enum(CATEGORY_OPITIONS).catch("ALL"),
  sort: z.enum(SORT_OPTIONS).catch("newest"),
  q: z.string().transform(cleanSearchText).catch(""),
  page: z.coerce.number().int().min(1).max(10000).catch(1),
});

export type FeedParams = z.infer<typeof feedParamsSchema>;

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseFeedParams(raw: RawSearchParams): FeedParams {
  return feedParamsSchema.parse({
    category: raw.category,
    sort: raw.sort,
    q: raw.q,
    page: raw.page,
  });
}
