'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/ToastContext';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { notify } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const inStock = (product.inventory ?? 0) > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock || isAdding) return;
    setIsAdding(true);
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    });
    notify({ variant: 'success', message: `${product.name} added to cart` });
    window.setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-border bg-surface shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-gold/30 hover:shadow-sm">
      <Link href={`/products/${product.slug}`} className="block relative h-60 sm:h-72 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
      </Link>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{product.category}</p>
          <h3 className="break-words font-serif text-lg text-text-primary sm:text-xl">{product.name}</h3>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-lg font-semibold text-gold">₦{Number(product.price ?? 0).toLocaleString()}</span>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-muted">
            {inStock ? 'Available' : 'Sold out'}
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!inStock || isAdding}
            className="inline-flex w-full justify-center rounded-full bg-gold px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#1E1E1E] disabled:text-text-muted disabled:shadow-none"
          >
            {isAdding ? '✓ Added' : inStock ? 'Add to cart' : 'Sold out'}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-4 py-3.5 text-sm font-semibold text-text-muted transition-colors hover:border-gold/50 hover:text-gold"
            title="View details"
          >
            →
          </Link>
        </div>
      </div>
    </article>
  );
}
