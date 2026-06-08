'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Error boundary displayed; do not log sensitive details in production.
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="max-w-xl text-slate-600">An unexpected error occurred. Please try again or refresh the page.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        Reload page
      </button>
    </div>
  );
}
