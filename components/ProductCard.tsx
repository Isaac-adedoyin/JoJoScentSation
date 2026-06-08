import Link from 'next/link';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-accent-400/40 hover:shadow-[0_40px_120px_rgba(168,85,247,0.18)]">
      <Link href={`/products/${product.slug}`} className="block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{product.category}</p>
          <h3 className="text-xl font-semibold uppercase tracking-[0.08em] text-white">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-accent-300">₦{product.price.toLocaleString()}</span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-400">
            {product.inventory > 0 ? `${product.inventory} in stock` : 'Sold out'}
          </span>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex w-full justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 transition duration-300 hover:border-accent-400 hover:bg-white/10"
        >
          View perfume
        </Link>
      </div>
    </article>
  );
}
