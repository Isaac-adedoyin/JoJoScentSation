'use client';

import { FormEvent, useState } from 'react';
import { useToast } from '@/components/ToastContext';

export default function NewsletterSignup() {
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

  return (
    <section className="rounded-[2rem] border border-amber-200/10 bg-[#090909] p-8 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">Join our list</p>
          <h3 className="mt-3 text-3xl font-semibold text-cream sm:text-4xl">Receive new fragrance drops, offers and styling notes.</h3>
        </div>

        <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-slate-800 bg-[#0d0d0d] px-5 py-4 text-sm text-cream outline-none transition focus:border-amber-200/80 focus:ring-4 focus:ring-amber-200/10"
          />
          <button
            type="submit"
            className="rounded-full bg-amber-200 px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#050505] transition hover:bg-amber-300"
          >
            {submitted ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
      </div>
      <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
        No spam. Only polished fragrance stories, exclusive offers and first access to new launches.
      </p>
    </section>
  );
}
