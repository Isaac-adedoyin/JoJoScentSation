'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

export default function ProductsClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ['All', ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        !q || p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, activeCategory]);

  return (
    <div>
      {/* Modern Filter Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <button
            type="button"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-semibold text-text-primary transition hover:text-gold"
          >
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20" fill="none" aria-hidden="true"
            >
              <path d="M4 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Filter & Search
          </button>
          <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted">
            {filtered.length} {filtered.length === 1 ? 'fragrance' : 'fragrances'}
          </span>
        </div>

        {/* Expanding Panel */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isFiltersOpen ? 'max-h-96 opacity-100 pt-6' : 'max-h-0 opacity-0 pt-0'
          }`}
        >
          <div className="flex flex-col rounded-[1.5rem] bg-surface p-6 border border-border shadow-sm">
            <div className="relative w-full">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gold">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fragrances…"
                className="w-full rounded-full border border-border bg-surface py-3.5 pl-11 pr-5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                aria-label="Search fragrances"
              />
            </div>

            <div className="w-full mt-6 pt-6 border-t border-border">
              <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-4">Categories</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition duration-200 ${
                      activeCategory === cat
                        ? 'border-gold bg-gold text-[#0A0A0A]'
                        : 'border-border bg-surface text-text-muted hover:border-gold/40 hover:text-gold'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-border-subtle bg-surface p-12 text-center text-text-muted shadow-sm">
          <p className="font-serif text-lg text-text-primary">No fragrances found</p>
          <p className="mt-2 text-sm">Try a different search term or category.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setActiveCategory('All'); }}
            className="mt-6 rounded-full border border-border bg-surface px-5 py-2 text-sm font-semibold text-text-muted transition hover:border-gold/40 hover:text-gold"
          >
            Clear filters
          </button>
        </div>
      )}


    </div>
  );
}
