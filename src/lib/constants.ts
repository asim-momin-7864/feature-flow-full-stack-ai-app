// badge colour for each category (uses shadcn Badge variants)
export function getCategoryVariant(category: string) {
  if (category === "BUG") return "destructive";
  if (category === "UI") return "secondary";
  return "default";
}

// one date format for the whole app, e.g. "25 Oct 2026"
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
