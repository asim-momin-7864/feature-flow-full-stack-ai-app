import { z } from "zod";

const CATEGORY_OPTIONS = ["ALL", "FEATURE", "BUG", "UI"] as const;
const SORT_OPTIONS = ["newest", "upvotes"] as const;

// % and _ are wildcards in SQL ilike, so remove them from user text
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
  category: z.enum(CATEGORY_OPTIONS).catch("ALL"),
  sort: z.enum(SORT_OPTIONS).catch("newest"),
  q: z.string().transform(cleanSearchText).catch(""),
});

export type FeedParams = z.infer<typeof feedParamsSchema>;
export type RawSearchParams = Record<string, string | string[] | undefined>;

// zod ignores keys it doesn't know, and .catch() gives a default for bad values
export function parseFeedParams(raw: RawSearchParams): FeedParams {
  return feedParamsSchema.parse(raw);
}
