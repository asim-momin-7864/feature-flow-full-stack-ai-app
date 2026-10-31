"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createFeedbackAction } from "@/actions/feedback";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { SimilarIdeas } from "@/components/custome/similar-ideas";

export default function NewFeedbackPage() {
  const [state, formAction, isPending] = useActionState(createFeedbackAction, {
    success: false,
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <Card className="flex flex-col gap-6 p-5 sm:p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Submit Feedback</h1>
          <p className="text-sm text-muted-foreground">
            Have an idea or found a bug? Let us know!
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="E.g. Add dark mode"
              maxLength={100}
              required
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              5 to 100 characters.
            </p>
            {state.errors?.title && (
              <p className="text-sm text-destructive">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select name="category" defaultValue="FEATURE">
              <SelectTrigger id="category" className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEATURE">Feature Request</SelectItem>
                <SelectItem value="BUG">Bug Report</SelectItem>
                <SelectItem value="UI">UI / Design</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.category && (
              <p className="text-sm text-destructive">
                {state.errors.category[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your idea or the problem in detail..."
              maxLength={1000}
              required
              className="min-h-40"
            />
            <p className="text-xs text-muted-foreground">
              5 to 1000 characters.
            </p>
            <SimilarIdeas />
            {state.errors?.description && (
              <p className="text-sm text-destructive">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          {state.message && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                className: "h-11 sm:px-6",
              })}
            >
              Cancel
            </Link>
            <Button type="submit" disabled={isPending} className="h-11 sm:px-6">
              {isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
