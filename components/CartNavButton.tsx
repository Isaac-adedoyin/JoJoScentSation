'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartNavButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="hidden items-center gap-3 rounded-full border border-[#E8DDCB] bg-white px-4 py-2 uppercase tracking-[0.25em] text-[#2D2D2D] shadow-[0_10px_24px_rgba(76,60,38,0.06)] transition hover:border-[#D6B98C] hover:text-[#B99867] md:inline-flex"
    >
      <span>Cart</span>
      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#D6B98C] px-2 text-[10px] font-semibold tracking-normal text-[#2D2D2D]">
        {itemCount}
      </span>
    </Link>
  );
}
