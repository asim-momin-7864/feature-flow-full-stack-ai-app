import { z } from "zod";

export const categoryEnum = z.enum(["FEATURE", "BUG", "UI"]);
export const statusEnum = z.enum([
  "UNDER_REVIEW",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
]);
export type statusEnumType = z.infer<typeof statusEnum>;

// input schemas (used by server actions)
export const CreateFeedbackSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(1000),
  category: categoryEnum,
});

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, "Comment is too short")
    .max(1000, "Comment is too long"),
});

// row shapes (what we read back from the database)
type ProfileInfo = {
  full_name: string | null;
  avatar_url: string | null;
} | null;

export type FeedbackType = z.infer<typeof CreateFeedbackSchema> & {
  id: string;
  created_at: string;
  user_id: string;
  status: statusEnumType;
  is_deleted: boolean;
  deleted_by_admin: boolean;
  deleted_at: string | null;
  vote_count: number; // from vw_feedback_details
  tags: string[] | null;
  comment_count: number; // from vw_feedback_details
  profile: ProfileInfo;
};

export type CommentType = z.infer<typeof CreateCommentSchema> & {
  id: string;
  user_id: string;
  feedback_id: string;
  created_at: string;
  is_deleted: boolean;
  deleted_by_admin: boolean;
  deleted_at: string | null;
  profile: ProfileInfo;
};
