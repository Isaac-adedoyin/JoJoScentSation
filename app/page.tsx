import Link from 'next/link';
import Image from 'next/image';
import FeaturedProductCard from '@/components/FeaturedProductCard';
import NewsletterSignup from '@/components/NewsletterSignup';
import getClient from '@/lib/mongodb';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import { normalizeProductSlugs } from '@/lib/product-slugs';

export const revalidate = 60;

async function getFeaturedProducts(): Promise<Product[]> {
  const client = await getClient();
  const db = client.db();
  await normalizeProductSlugs(db);
  const products = await db
    .collection<Product & { _id: ObjectId }>('products')
    .find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();

  return products.map((product) => ({
    ...product,
    _id: product._id.toString()
  }));
}

const pillars = [
  {
    icon: '◈',
    title: 'Signature Depth',
    description: 'Fragrances engineered to leave a lasting impression on every occasion.'
  },
  {
    icon: '◇',
    title: 'Refined Design',
    description: 'Elegant bottling and packaging that feel collectible and gift-ready.'
  },
  {
    icon: '◉',
    title: 'Curated Edits',
    description: 'A carefully selected collection of scents for the modern luxury collector.'
  },
  {
    icon: '◎',
    title: 'Seamless Service',
    description: 'Fast checkout, secure payments, and a polished order experience.'
  }
];

const testimonials = [
  {
    quote: 'Every bottle feels like a private collection. The scents are rich, memorable, and truly refined.',
    author: 'Amara E.',
    title: 'Loyal customer since 2023'
  },
  {
    quote: 'The packaging, service, and product quality all speak of luxury. My favourite perfume destination.',
    author: 'Liam O.',
    title: 'Verified buyer'
  }
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <main className="bg-background text-text-primary">

      {/* ═══════════════════════════════════════
          HERO — Asymmetric editorial split
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[100svh] grid lg:grid-cols-[55%_45%]">
        {/* Left — Moody hero image */}
        <div className="relative h-[55vw] min-h-[360px] lg:h-auto overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85"
            alt="Luxury perfume editorial"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center"
          />
          {/* Dark vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
        </div>

        {/* Right — Stacked editorial type */}
        <div className="relative flex flex-col justify-center px-8 py-16 lg:px-14 xl:px-20">
          {/* Gold overline */}
          <p className="text-[10px] uppercase tracking-[0.50em] text-gold mb-6">
            Jojo Scentsation
          </p>

          {/* Stacked hero words */}
          <div className="space-y-1">
            {['PURE', 'SCENT', 'LUXURY'].map((word, i) => (
              <div key={word}>
                <h1
                  className="font-serif leading-[0.9] text-[13vw] sm:text-[11vw] lg:text-[7vw] xl:text-[6.5vw] text-text-primary"
                  style={{ fontWeight: 400 }}
                >
                  {word}
                </h1>
                {i < 2 && (
                  <div className="my-3 h-px w-full bg-gradient-to-r from-[#C9A85C]/50 via-[#C9A85C]/20 to-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Sub-copy */}
          <p className="mt-8 max-w-xs text-sm leading-7 text-text-muted">
            A modern fragrance boutique where premium scent, polished presentation, and effortless luxury converge.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm"
            >
              Explore Collection
            </Link>
            <Link
              href="/#story"
              className="inline-flex items-center justify-center rounded-full border border-border px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              Our Story
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="mt-14 hidden lg:flex items-center gap-3 text-[#3A3328]">
            <div className="h-px w-10 bg-[#2A2A2A]" />
            <span className="text-[9px] uppercase tracking-[0.4em]">Scroll</span>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          FEATURED PRODUCTS — Horizontal rail
      ═══════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header row */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.40em] text-gold">Featured Scents</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-text-primary">Most Loved Perfumes</h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-text-muted transition hover:text-gold"
            >
              See all
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Horizontal scrolling rail */}
          {featured.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
              {featured.map((product) => (
                <FeaturedProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-border-subtle bg-surface p-12 text-center text-text-muted">
              <p className="text-sm">No featured products yet. Add them from the admin dashboard.</p>
            </div>
          )}

          {/* Mobile see all */}
          <Link
            href="/products"
            className="mt-8 flex sm:hidden items-center justify-center gap-2 text-[11px] uppercase tracking-[0.28em] text-text-muted transition hover:text-gold"
          >
            View all fragrances →
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PULL QUOTE
      ═══════════════════════════════════════ */}
      <section className="border-y border-border-subtle bg-surface py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-6xl leading-none text-gold/25 font-serif select-none">"</span>
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-[#D4C9B8] leading-[1.4] -mt-4">
            The scent you wear tells the story before you speak.
          </blockquote>
          <p className="mt-6 text-[10px] uppercase tracking-[0.45em] text-gold">Jojo Scentsation</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY CHOOSE US — 4 pillars
      ═══════════════════════════════════════ */}
      <section id="story" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.40em] text-gold">Why Choose Us</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-text-primary">Fragrance, crafted with boutique warmth.</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-[1.5rem] border border-border-subtle bg-surface p-6 transition duration-300 hover:border-gold/20 hover:bg-border-subtle"
              >
                <span className="text-2xl text-gold/60">{pillar.icon}</span>
                <h3 className="mt-4 font-serif text-lg text-text-primary">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════
          NEWSLETTER — Dark version
      ═══════════════════════════════════════ */}
      <section className="border-t border-border-subtle py-20 px-4">
        <div className="mx-auto max-w-7xl sm:px-6">
          <NewsletterSignup dark />
        </div>
      </section>

    </main>
  );
}
