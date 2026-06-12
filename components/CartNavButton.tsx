'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartNavButton() {
  const { itemCount, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      type="button"
      className="relative inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[11px] font-medium uppercase tracking-[0.25em] text-text-muted transition hover:border-gold/40 hover:text-gold"
      aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
    >
      {/* Cart icon */}
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Cart</span>
      {itemCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[9px] font-bold tracking-normal text-[#0A0A0A]">
          {itemCount}
        </span>
      )}
    </button>
  );
}
