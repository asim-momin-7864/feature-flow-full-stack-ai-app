"use client";

import React, { useActionState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { createFeedbackAction, type ActionState } from "@/actions/feedback";

const initialState: ActionState = {
  success: false,
  errors: {},
  message: "",
};

export default function NewFeedbackPage() {
  // state
  const [state, formAction, isPending] = useActionState(
    createFeedbackAction,
    initialState,
  );

  return (
    <div className="w-full max-w-2xl px-4 py-6 sm:py-10 mx-auto">
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold">Submit Feedback</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Have an idea or found a bug? Let us know so we can improve!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 sm:pt-4">
          <form className="flex flex-col gap-4 sm:gap-6" action={formAction}>
            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="title" className="text-xs sm:text-sm font-medium">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g. Add dark mode support"
                required
                className="text-sm"
              />
              {state?.errors?.title && (
                <p className="text-destructive text-xs sm:text-sm font-medium">
                  {state.errors.title[0]}
                </p>
              )}
            </div>

            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="category" className="text-xs sm:text-sm font-medium">Category</Label>
              <Select name="category" defaultValue="FEATURE" required>
                <SelectTrigger id="category" className="w-full text-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEATURE">Feature Request</SelectItem>
                  <SelectItem value="BUG">Bug Report</SelectItem>
                  <SelectItem value="UI">UI / Design</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.category && (
                <p className="text-destructive text-xs sm:text-sm font-medium">
                  {state.errors.category[0]}
                </p>
              )}
            </div>

            <div className="grid gap-1.5 sm:gap-2">
              <Label htmlFor="description" className="text-xs sm:text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe your feedback in detail..."
                rows={5}
                required
                className="text-sm resize-y min-h-28"
              />
              {state?.errors?.description && (
                <p className="text-destructive text-xs sm:text-sm font-medium">
                  {state.errors.description[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 mt-2 sm:mt-4">
              <Link
                href="/"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full sm:w-auto text-center text-xs sm:text-sm",
                })}
              >
                Cancel
              </Link>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto font-semibold text-xs sm:text-sm">
                {isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
