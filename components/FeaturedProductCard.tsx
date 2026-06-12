'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/ToastContext';
import type { Product } from '@/lib/types';

export default function FeaturedProductCard({ product }: { product: Product }) {
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
    window.setTimeout(() => setIsAdding(false), 700);
  };

  return (
    <article
      className="group relative flex-shrink-0 w-[240px] sm:w-[280px] overflow-hidden rounded-[1.5rem] border border-border-subtle bg-surface transition-all duration-500 hover:border-gold/30 hover:shadow-sm"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative h-[220px] sm:h-[260px] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="280px"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
      </Link>

      {/* Content */}
      <div className="p-5">
        <p className="text-[9px] uppercase tracking-[0.35em] text-gold">{product.category}</p>
        <h3 className="mt-1.5 font-serif text-base text-text-primary leading-snug line-clamp-1">{product.name}</h3>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-base font-semibold text-gold">₦{Number(product.price ?? 0).toLocaleString()}</span>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!inStock || isAdding}
            aria-label={inStock ? `Add ${product.name} to cart` : 'Out of stock'}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold transition hover:bg-gold hover:text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {isAdding ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {!inStock && (
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-text-muted">Sold out</p>
        )}
      </div>
    </article>
  );
}
