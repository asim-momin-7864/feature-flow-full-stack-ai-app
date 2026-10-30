// feedback deatils page - using PPR

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { FeedbackType } from "@/lib/validations";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import DeleteButton from "@/components/custome/delete-button";
import CommentForm from "@/components/custome/comment-form";
import CommentList from "@/components/custome/comment-list";
import { getCategoryStyles } from "@/components/custome/feedback-card";
import Upvote from "@/components/custome/upvote";
import { hasUserVoted } from "@/lib/queries";
import StatusUpdateButton from "@/components/custome/status-update-button";
import Link from "next/link";
import { CornerUpLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/get-current-user";
import { notFound } from "next/navigation";

// helper component
const FeedbackDetailsHelper = async ({
  idPromise,
}: {
  idPromise: Promise<{ id: string }>;
}) => {
  // id
  const id = (await idPromise).id;

  // fetch data
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_feedback_details")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // error
  if (error) {
    return (
      <p className="text-center text-destructive py-10">
        {error?.message || "Some error in fetching"}
      </p>
    );
  }

  if (!data) {
    return notFound();
  }

  // type casting
  const feedbackData = data as unknown as FeedbackType;

  // check user auth and owner
  const { isAdmin, userData } = await getCurrentUser();

  const isOwner = userData ? userData.id === feedbackData.user_id : false;

  const isVoted = userData
    ? await hasUserVoted(feedbackData.id, userData.id)
    : false;

  const styles = getCategoryStyles(feedbackData.category);

  // render
  // as safety major if use by mistake try to open deleted feedback page details page
  if (feedbackData.is_deleted || feedbackData.deleted_at) {
    return (
      <div className="w-full p-10 mt-10 border border-dashed rounded-xl bg-muted/20 text-muted-foreground text-center text-lg italic flex flex-col items-center gap-2">
        <span>
          This feedback was deleted by{" "}
          {feedbackData.deleted_by_admin
            ? "an admin"
            : feedbackData.profile?.full_name || "the author"}
          .
        </span>
        {feedbackData.deleted_at && (
          <span className="text-sm opacity-70">
            {new Date(feedbackData.deleted_at).toDateString()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* back link */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <CornerUpLeft size={16} />
          Go back
        </Link>
      </div>

      {/* Header Area */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-md ${styles.badge}`}
          >
            {feedbackData.category}
          </Badge>
          <Badge
            variant="outline"
            className="capitalize px-2.5 py-0.5 text-xs rounded-md"
          >
            {feedbackData.status.toLowerCase().replace("_", " ")}
          </Badge>
        </div>

        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight break-words flex-1 min-w-0">
            {feedbackData.title}
          </h1>
          {(isOwner || isAdmin) && (
            <div className="pt-0.5 sm:pt-1 shrink-0">
              <DeleteButton id={id} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-1">
          <span className="font-medium text-foreground">
            {feedbackData.profile?.full_name || "Anonymous"}
          </span>
          <span>•</span>
          <span>
            {new Date(feedbackData.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Description Content */}
      <Card className="w-full">
        <CardContent className="p-4 sm:p-6">
          <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base text-foreground break-words">
            {feedbackData.description}
          </p>
        </CardContent>
      </Card>

      {/* Upvote Banner */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-muted/40 rounded-xl border">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm sm:text-base text-foreground">
            Do you agree with this feedback?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Upvote to help this idea get prioritized by the team!
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-auto">
          <Upvote feedbackData={feedbackData} isVoted={isVoted} />
        </div>
      </div>

      {isAdmin && (
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-muted/30 rounded-xl border border-dashed">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Admin</Badge>
              Update Status
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Change the progress status of this feedback.
            </p>
          </div>
          <div className="w-full sm:w-auto shrink-0">
            <StatusUpdateButton
              feedback_id={feedbackData.id}
              currentState={feedbackData.status}
            />
          </div>
        </div>
      )}

      <Separator className="my-6 sm:my-8" />

      {/* Comments Section */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8 w-full">
        {/* On mobile, comment form comes first so user can write quickly without scrolling past all comments */}
        <div className="order-first lg:order-last lg:col-span-1">
          <CommentForm feedback_id={feedbackData.id} />
        </div>

        {/* Comments List */}
        <div className="order-last lg:order-first lg:col-span-2 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            Comments
            <Badge variant="secondary">
              {feedbackData.comment_count ??
                (feedbackData?.comment as [{ count: number }])?.[0]?.count ??
                0}
            </Badge>
          </h2>
          <CommentList feedbackId={feedbackData.id} />
        </div>
      </div>
    </div>
  );
};

// main componenet
const FeedbackDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <div className="min-h-screen max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 md:py-12 flex flex-col items-start">
      <Suspense
        fallback={
          <p className="text-muted-foreground text-sm sm:text-base">
            Loading details...
          </p>
        }
      >
        <FeedbackDetailsHelper idPromise={params} />
      </Suspense>
    </div>
  );
};

export default FeedbackDetailsPage;
