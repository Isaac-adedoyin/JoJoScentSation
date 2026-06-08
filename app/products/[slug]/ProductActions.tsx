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
    <div className="rounded-[2rem] border border-[#E8DDCB] bg-white p-8 shadow-[0_18px_45px_rgba(76,60,38,0.08)]">
      <div className="space-y-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-[#2D2D2D]">
          Quantity
          <input
            type="number"
            min={1}
            max={product.inventory}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="mt-1 rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 outline-none transition focus:border-[#D6B98C]"
          />
        </label>
        <button
          type="button"
          disabled={product.inventory === 0 || isAdding}
          onClick={handleAddToCart}
          className="inline-flex w-full justify-center rounded-full bg-[#D6B98C] px-6 py-4 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80] disabled:cursor-not-allowed disabled:bg-[#E5DACA]"
        >
          {isAdding ? 'Adding to cart...' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
