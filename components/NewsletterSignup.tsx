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
    <section className="rounded-[2rem] border border-[#E8DDCB] bg-white p-8 shadow-[0_18px_45px_rgba(76,60,38,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#B99867]">Join our list</p>
          <h3 className="mt-3 text-3xl font-semibold text-[#2D2D2D] sm:text-4xl">Receive new fragrance drops, offers and styling notes.</h3>
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
            className="min-w-0 flex-1 rounded-full border border-[#E3D3BA] bg-[#FFFCF8] px-5 py-4 text-sm text-[#2D2D2D] outline-none transition focus:border-[#D6B98C] focus:ring-4 focus:ring-[#D6B98C]/15"
          />
          <button
            type="submit"
            className="rounded-full bg-[#D6B98C] px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#2D2D2D] transition hover:bg-[#CDAE80]"
          >
            {submitted ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
      </div>
      <p className="mt-4 max-w-xl text-sm leading-6 text-[#61584D]">
        No spam. Only polished fragrance stories, exclusive offers and first access to new launches.
      </p>
    </section>
  );
}
