import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { embedText, feedbackText, SIMILARITY_THRESHOLD } from "@/lib/ai";

const BodySchema = z.object({
  title: z.string().trim().min(10).max(150),
  description: z.string().trim().max(1000).default(""),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ matches: [] }, { status: 401 });

  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ matches: [] }, { status: 400 });

  try {
    const vector = await embedText(
      feedbackText(body.data.title, body.data.description),
    );

    const { data, error } = await supabase.rpc("match_similar_feedback", {
      query_embedding: JSON.stringify(vector),
      match_threshold: SIMILARITY_THRESHOLD,
      match_count: 3,
    });
    if (error) throw new Error(error.message);

    return NextResponse.json({ matches: data ?? [] });
  } catch (e) {
    console.error("similar search failed:", e);
    return NextResponse.json({ matches: [], unavailable: true });
  }
}
