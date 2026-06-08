'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import type { Product } from '@/lib/types';

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

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
            className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500"
          />
        </label>
        <button
          type="button"
          disabled={product.inventory === 0}
          onClick={() =>
            addItem({
              productId: product._id,
              name: product.name,
              price: product.price,
              quantity,
              imageUrl: product.imageUrl
            })
          }
          className="inline-flex w-full justify-center rounded-full bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
