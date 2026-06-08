import Link from 'next/link';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-brand-700">₦{product.price.toLocaleString()}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-700">
            {product.inventory > 0 ? `${product.inventory} in stock` : 'Sold out'}
          </span>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex w-full justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          View perfume
        </Link>
      </div>
    </article>
  );
}
