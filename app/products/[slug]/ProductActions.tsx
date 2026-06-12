'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/ToastContext';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/components/AuthModalProvider';
import type { Product } from '@/lib/types';

export default function ProductActions({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddToCart() {
    if (!session) {
      openAuthModal('login');
      return;
    }

    if (product.inventory === 0 || isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      const safeQuantity = Math.max(1, Math.min(quantity, product.inventory || 1));

      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: safeQuantity,
        imageUrl: product.imageUrl
      });

      openCart();
    } finally {
      window.setTimeout(() => {
        setIsAdding(false);
      }, 250);
    }
  }

  return (
    <div className="rounded-[2rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-8">
      <div className="space-y-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-text-muted">
          Quantity
          <input
            type="number"
            min={1}
            max={product.inventory}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 rounded-full border border-border bg-surface px-5 py-3.5 text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
          />
        </label>
        <button
          type="button"
          disabled={product.inventory === 0 || isAdding}
          onClick={handleAddToCart}
          className="inline-flex w-full justify-center rounded-full bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#1E1E1E] disabled:text-text-muted disabled:shadow-none"
        >
          {isAdding ? 'Adding to cart...' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
