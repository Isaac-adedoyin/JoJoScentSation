'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/ToastContext';
import type { Product } from '@/lib/types';

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { notify } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddToCart() {
    if (product.inventory === 0 || isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl
      });

      notify({
        variant: 'success',
        message: product.name ? `${product.name} added to cart` : 'Item added successfully'
      });
    } finally {
      window.setTimeout(() => {
        setIsAdding(false);
      }, 250);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Quantity
          <input
            type="number"
            min={1}
            max={product.inventory}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-accent-500"
          />
        </label>
        <button
          type="button"
          disabled={product.inventory === 0 || isAdding}
          onClick={handleAddToCart}
          className="inline-flex w-full justify-center rounded-full bg-accent-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isAdding ? 'Adding to cart...' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
