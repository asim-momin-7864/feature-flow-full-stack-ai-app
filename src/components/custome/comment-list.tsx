import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/constants";
import type { CommentType } from "@/lib/validations";
import DeleteCommentButton from "@/components/custome/delete-comment-button";
import { ProfileAvatar } from "@/components/custome/profile-avatar";

export default async function CommentList({
  feedbackId,
  currentUserId,
  isAdmin,
}: {
  feedbackId: string;
  currentUserId?: string;
  isAdmin: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comment")
    .select("*, profile(full_name, avatar_url)")
    .eq("feedback_id", feedbackId)
    .order("created_at", { ascending: true }); // oldest first

  if (error) throw new Error(error.message);

  const comments = (data ?? []) as unknown as CommentType[];

  if (comments.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-6 text-center text-sm italic text-muted-foreground">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const name = comment.profile?.full_name || "Anonymous";
        const canDelete =
          (comment.user_id === currentUserId || isAdmin) && !comment.is_deleted;

        return (
          <div
            key={comment.id}
            className="flex gap-3 rounded-xl border bg-card p-3 sm:p-4"
          >
            <ProfileAvatar
              url={comment.profile?.avatar_url}
              name={name}
              className="h-9 w-9"
            />

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                {canDelete && (
                  <DeleteCommentButton
                    commentId={comment.id}
                    feedbackId={feedbackId}
                  />
                )}
              </div>

              {comment.is_deleted ? (
                <p className="text-sm italic text-muted-foreground">
                  This comment was deleted by{" "}
                  {comment.deleted_by_admin ? "an admin" : "the author"}.
                </p>
              ) : (
                <p className="whitespace-pre-wrap break-words text-sm">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
