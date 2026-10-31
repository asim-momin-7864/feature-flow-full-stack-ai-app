import Link from "next/link";
import { notFound } from "next/navigation";
import { CornerUpLeft, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { hasUserVoted } from "@/lib/queries";
import { formatDate, getCategoryVariant } from "@/lib/constants";
import type { FeedbackType } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Upvote from "@/components/custome/upvote";
import DeleteButton from "@/components/custome/delete-button";
import StatusUpdateButton from "@/components/custome/status-update-button";
import CommentForm from "@/components/custome/comment-form";
import CommentList from "@/components/custome/comment-list";
import { ProfileAvatar } from "@/components/custome/profile-avatar";

const TAG_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
];

export default async function FeedbackDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_feedback_details")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) notFound();

  const feedback = data as unknown as FeedbackType;

  const { isAdmin, userData } = await getCurrentUser();
  const isOwner = userData?.id === feedback.user_id;
  const isVoted = userData
    ? await hasUserVoted(feedback.id, userData.id)
    : false;
  const name = feedback.profile?.full_name || "Anonymous";

  // deleted post: show a small message instead of the content
  if (feedback.is_deleted) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-dashed p-8 text-center italic text-muted-foreground">
          This feedback was deleted by{" "}
          {feedback.deleted_by_admin ? "an admin" : name}
          {feedback.deleted_at && ` on ${formatDate(feedback.deleted_at)}`}.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <CornerUpLeft size={16} /> Go back
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getCategoryVariant(feedback.category)}>
          {feedback.category}
        </Badge>
        <Badge variant="outline" className="capitalize">
          {feedback.status.toLowerCase().replace("_", " ")}
        </Badge>
        <div className="flex flex-wrap gap-2">
          {feedback.tags?.map((tag, i) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm ${TAG_COLORS[i % 3]}`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* title + delete */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="min-w-0 break-words text-2xl font-bold leading-tight sm:text-3xl">
          {feedback.title}
        </h1>
        {(isOwner || isAdmin) && <DeleteButton id={id} />}
      </div>

      {/* author */}
      <div className="flex items-center gap-3">
        <ProfileAvatar
          url={feedback.profile?.avatar_url}
          name={name}
          className="h-10 w-10"
        />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(feedback.created_at)}
          </p>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed sm:text-base">
          {feedback.description}
        </p>
      </Card>

      <Upvote
        feedbackId={feedback.id}
        voteCount={feedback.vote_count ?? 0}
        isVoted={isVoted}
      />

      {/* admin only */}
      {isAdmin && (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Admin controls
            </p>
            <p className="text-xs text-muted-foreground">
              Change the status of this feedback.
            </p>
          </div>
          <StatusUpdateButton
            feedback_id={feedback.id}
            currentState={feedback.status}
          />
        </div>
      )}

      <Separator />

      <h2 className="flex items-center gap-2 text-xl font-bold">
        Comments{" "}
        <Badge variant="secondary">{feedback.comment_count ?? 0}</Badge>
      </h2>
      <CommentForm feedback_id={feedback.id} />
      <CommentList
        feedbackId={feedback.id}
        currentUserId={userData?.id}
        isAdmin={isAdmin}
      />
    </main>
  );
}
