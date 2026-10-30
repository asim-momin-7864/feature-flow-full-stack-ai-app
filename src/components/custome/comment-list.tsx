// fetch client list - PPR
import { createClient } from "@/lib/supabase/server";
import type { CommentType } from "@/lib/validations";
import { Suspense } from "react";

import DeleteCommentButton from "@/components/custome/delete-comment-button";
import { UserAvatar } from "@/components/custome/user-avatar";
import { getCurrentUser } from "@/lib/get-current-user";

// helper func
const CommentListFetch = async ({ feedbackId }: { feedbackId: string }) => {
  // Get current user and role to conditionally show the delete button
  const { isAdmin, userData } = await getCurrentUser();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comment")
    .select("*, profile(full_name, avatar_url)")
    .eq("feedback_id", feedbackId)
    .order("created_at", { ascending: true }); // older comments first

  if (error || !data || data.length === 0) {
    return (
      <div className="text-muted-foreground italic p-6 sm:p-8 border border-dashed rounded-xl bg-muted/20 text-center text-xs sm:text-sm">
        No comments yet. Be the first to suggest something!
      </div>
    );
  }

  const commentsArray = data as unknown as CommentType[];

  return (
    <div className="space-y-3 sm:space-y-4">
      {commentsArray.map((comment) => {
        const isOwner = userData?.id === comment.user_id;

        return (
          <div
            key={comment.id}
            className="flex gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl bg-card border"
          >
            {/* Avatar */}
            <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full overflow-hidden border bg-muted">
              <UserAvatar
                url={comment.profile?.avatar_url}
                fallbackText={comment.profile?.full_name?.charAt(0) || "U"}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                    {comment.profile?.full_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                {(isOwner || isAdmin) &&
                  !comment.is_deleted &&
                  !comment.deleted_at && (
                    <DeleteCommentButton
                      commentId={comment.id}
                      feedbackId={feedbackId}
                    />
                  )}
              </div>

              {comment.is_deleted || comment.deleted_at ? (
                <div className="text-xs sm:text-sm text-muted-foreground italic border border-dashed rounded-md p-2.5 sm:p-3 mt-1">
                  This comment was deleted by{" "}
                  {comment.deleted_by_admin ? "an admin" : "the author"}.
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed break-words">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// main func
const CommentList = async ({ feedbackId }: { feedbackId: string }) => {
  return (
    <div>
      <Suspense>
        <CommentListFetch feedbackId={feedbackId} />
      </Suspense>
    </div>
  );
};

export default CommentList;
