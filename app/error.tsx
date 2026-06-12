'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Error boundary displayed; do not log sensitive details in production.
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">Something went wrong</h1>
      <p className="max-w-xl text-text-muted">An unexpected error occurred. Please try again or refresh the page.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-gold/90"
      >
        Reload page
      </button>
    </div>
  );
}
