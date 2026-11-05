"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Match = {
  id: string;
  title: string;
  vote_count: number;
  similarity: number;
};

export function SimilarIdeas() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function check(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    if (!form) return;

    const data = new FormData(form);
    const title = String(data.get("title") ?? "");
    const description = String(data.get("description") ?? "");

    setMatches([]);
    if (title.trim().length < 10) {
      setMessage("Type a longer title first (at least 10 characters).");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const json = await res.json();

      if (res.status === 401) {
        setMessage("Log in to check for similar ideas.");
      } else if (!res.ok || json.unavailable) {
        setMessage(
          "AI suggestions are temporarily unavailable. You can still submit.",
        );
      } else if (json.matches.length === 0) {
        setMessage("No similar ideas found.");
      } else {
        setMatches(json.matches);
      }
    } catch {
      setMessage(
        "AI suggestions are temporarily unavailable. You can still submit.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={check}
        disabled={loading}
        className="h-10 w-full sm:w-auto"
      >
        {loading ? "Checking..." : "Check similar ideas"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Tip: type &quot;Export feedback as CSV&quot; in the title and click Check similar ideas.
      </p>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}

      {matches.length > 0 && (
        <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
          <p className="text-sm font-medium">Looks like this already exists:</p>
          {matches.map((m) => (
            <Link
              key={m.id}
              href={`/feedback/${m.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3 text-sm hover:bg-muted/50"
            >
              <span className="min-w-0 break-words">{m.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {m.vote_count} votes · {Math.round(m.similarity * 100)}% match
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
