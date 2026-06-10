import Link from 'next/link';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[#ECE1D2] bg-white shadow-[0_18px_45px_rgba(76,60,38,0.08)] transition duration-500 hover:-translate-y-1 hover:border-[#D6B98C] hover:shadow-[0_24px_60px_rgba(76,60,38,0.12)]">
      <Link href={`/products/${product.slug}`} className="block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
        />
      </Link>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#8A7B67] sm:text-xs sm:tracking-[0.35em]">{product.category}</p>
          <h3 className="break-words text-lg font-semibold uppercase tracking-[0.05em] text-[#2D2D2D] sm:text-xl sm:tracking-[0.08em]">{product.name}</h3>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-lg font-semibold text-[#9A7643]">₦{Number(product.price ?? 0).toLocaleString()}</span>
          <span className="rounded-full border border-[#EFE5D8] bg-[#FCFAF6] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#8A7B67] sm:tracking-[0.35em]">
            {(product.inventory ?? 0) > 0 ? `${product.inventory} in stock` : 'Sold out'}
          </span>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex w-full justify-center rounded-full border border-[#E3D3BA] bg-[#FBF8F2] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#2D2D2D] transition duration-300 hover:border-[#D6B98C] hover:bg-[#F4EBDD] sm:tracking-[0.18em]"
        >
          View perfume
        </Link>
      </div>
    </article>
  );
}
