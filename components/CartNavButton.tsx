'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartNavButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 uppercase tracking-[0.25em] text-slate-100 transition hover:border-accent-300 hover:text-accent-300 md:inline-flex"
    >
      <span>Cart</span>
      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-500 px-2 text-[10px] font-semibold tracking-normal text-white">
        {itemCount}
      </span>
    </Link>
  );
}
