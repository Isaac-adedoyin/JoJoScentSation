'use client';

import { FormEvent, useState } from 'react';
import { useToast } from '@/components/ToastContext';

interface NewsletterSignupProps {
  dark?: boolean;
}

export default function NewsletterSignup({ dark = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { notify } = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      notify({ variant: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    setSubmitted(true);
    notify({ variant: 'success', message: 'You are subscribed to exclusive scent updates.' });
    setEmail('');
  };

  if (dark) {
    return (
      <section className="rounded-[2rem] border border-border-subtle bg-surface p-6 sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-gold">Join our list</p>
            <h3 className="mt-3 font-serif text-2xl text-text-primary sm:text-3xl lg:text-4xl">
              Receive new fragrance drops, offers and styling notes.
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-text-muted">
              Only polished fragrance stories and first access to new launches.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email-dark">Email address</label>
            <input
              id="newsletter-email-dark"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-border bg-surface px-5 py-3.5 text-sm text-text-primary placeholder-[#5A5040] outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
            />
            <button
              type="submit"
              className="rounded-full bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm"
            >
              {submitted ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Light variant (used on inner pages)
  return (
    <section className="rounded-[2rem] border border-border bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#9A7643] sm:text-sm sm:tracking-[0.35em]">Join our list</p>
          <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-3xl lg:text-4xl">
            Receive new fragrance drops, offers and styling notes.
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-border-subtle bg-[#FFFCF8] px-5 py-4 text-sm text-text-primary outline-none transition focus:border-[#D6B98C] focus:ring-4 focus:ring-[#D6B98C]/15"
          />
          <button
            type="submit"
            className="rounded-full bg-gold px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-text-primary transition hover:bg-gold/90 sm:tracking-[0.3em]"
          >
            {submitted ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
      </div>
      <p className="mt-4 max-w-xl text-sm leading-6 text-text-muted">
        Only polished fragrance stories, exclusive offers and first access to new launches.
      </p>
    </section>
  );
}
