// src/app/error.tsx
"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="p-8 text-center">
      <p className="font-medium">Something went wrong.</p>
      <button
        onClick={() => reset()}
        className="mt-3 rounded-md border px-4 py-2 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
