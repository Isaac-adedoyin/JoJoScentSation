import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import NewsletterSignup from '@/components/NewsletterSignup';
import getClient from '@/lib/mongodb';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import { normalizeProductSlugs } from '@/lib/product-slugs';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts(): Promise<Product[]> {
  const client = await getClient();
  const db = client.db();
  await normalizeProductSlugs(db);
  const products = await db
    .collection<Product & { _id: ObjectId }>('products')
    .find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();

  return products.map((product) => ({
    ...product,
    _id: product._id.toString()
  }));
}

const values = [
  { title: 'Signature depth', description: 'Fragrances engineered to leave a lasting impression.' },
  { title: 'Future-forward', description: 'Sleek scents with elevated notes and subtle glow.' },
  { title: 'Effortless luxury', description: 'Fast, polished checkout for every premium purchase.' }
];

const testimonials = [
  {
    quote: 'Every bottle feels like a private collection. The scents are rich, memorable, and truly refined.',
    author: 'Amara E.'
  },
  {
    quote: 'The packaging, service, and product quality all speak of luxury. This is my favorite perfume destination.',
    author: 'Liam O.'
  }
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <main className="bg-[#F8F5EF] text-[#2D2D2D]">
      <section className="relative overflow-hidden border-b border-[#E8DDCB] bg-[#F8F5EF] pb-20 pt-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(214,185,140,0.22),_transparent_24%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[#B99867] sm:text-sm sm:tracking-[0.45em]">Luxury Perfume Boutique</p>
              <h1 className="max-w-3xl text-3xl font-semibold uppercase tracking-[0.08em] text-[#2D2D2D] leading-tight sm:text-5xl sm:tracking-[0.18em] lg:text-6xl">
                JOJOSCENTSATION
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#61584D] sm:text-xl">
                A modern fragrance boutique where premium scent, polished presentation, and effortless luxury converge.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-[#D6B98C] px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#2D2D2D] shadow-[0_16px_36px_rgba(76,60,38,0.12)] transition duration-300 hover:scale-[1.01] hover:bg-[#CDAE80] sm:px-8 sm:tracking-[0.25em]"
              >
                Explore scents
              </Link>
              <Link
                href="/#why"
                className="inline-flex items-center justify-center rounded-full border border-[#E3D3BA] bg-[#FBF8F2] px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#2D2D2D] transition duration-300 hover:border-[#D6B98C] hover:bg-[#F4EBDD] sm:px-8 sm:tracking-[0.25em]"
              >
                Discover more
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="glass-panel rounded-[1.5rem] p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#B99867] sm:tracking-[0.35em]">{value.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[#61584D]">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-8 h-64 rounded-[2.5rem] bg-gradient-to-b from-[#D6B98C]/20 via-transparent to-transparent blur-3xl" />
            <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-6">
              <div className="relative overflow-hidden rounded-[2rem]">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
                  alt="Futuristic perfume showcase"
                  className="h-[320px] w-full object-cover transition duration-500 hover:scale-105 sm:h-[420px] lg:h-[520px]"
                />
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-[1.75rem] border border-[#E8DDCB] bg-[#FFFCF8]/95 p-4 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#B99867]">Featured scent</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#2D2D2D] sm:text-3xl">Noir Nova</h2>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[#61584D]">
                  A luminous trail of violet, oud, and warm woods wrapped in a modern sculptural bottle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#B99867] sm:text-sm sm:tracking-[0.35em]">Featured scents</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#2D2D2D] sm:text-4xl">Most loved perfumes</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center rounded-full border border-[#E3D3BA] bg-[#FBF8F2] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#2D2D2D] transition hover:border-[#D6B98C] hover:bg-[#F4EBDD] sm:tracking-[0.25em]"
          >
            See all products
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featured.length > 0 ? (
            featured.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="col-span-full rounded-[2rem] border border-[#E8DDCB] bg-white p-12 text-center text-[#61584D] shadow-[0_18px_45px_rgba(76,60,38,0.08)]">
              No products found. Please add featured products in the admin dashboard.
            </div>
          )}
        </div>
      </section>

      <section id="why" className="border-t border-[#E8DDCB] bg-[#FBF8F2] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#B99867] sm:text-sm sm:tracking-[0.35em]">Why choose us</p>
              <h2 className="text-3xl font-semibold text-[#2D2D2D] sm:text-4xl">Fragrance, crafted with boutique warmth.</h2>
              <p className="max-w-xl leading-8 text-[#61584D]">
                Premium scent stories designed for the modern collector. Elegant, memorable, and polished to perfection.
              </p>
            </div>

            <div className="space-y-6">
              <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
                <p className="text-xl font-semibold text-[#2D2D2D]">Signature notes</p>
                <p className="mt-3 text-[#61584D]">Complex accords built to wear beautifully and leave a memorable trail.</p>
              </div>
              <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
                <p className="text-xl font-semibold text-[#2D2D2D]">Refined design</p>
                <p className="mt-3 text-[#61584D]">Elegant bottling and packaging that feel collectible and gift-ready.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
                <p className="text-xl font-semibold text-[#2D2D2D]">Curated edits</p>
                <p className="mt-3 text-[#61584D]">A carefully selected collection of scents for modern luxury.</p>
              </div>
              <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
                <p className="text-xl font-semibold text-[#2D2D2D]">Seamless service</p>
                <p className="mt-3 text-[#61584D]">Fast checkout, secure payments, and polished order flow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="space-y-10 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-[#B99867] sm:text-sm sm:tracking-[0.35em]">Testimonials</p>
          <h2 className="text-3xl font-semibold text-[#2D2D2D] sm:text-4xl">What customers are saying</h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="glass-panel rounded-[2rem] p-6 text-[#554E45] sm:p-10">
              <p className="text-lg leading-8">“{item.quote}”</p>
              <footer className="mt-6 text-xs uppercase tracking-[0.24em] text-[#B99867] sm:text-sm sm:tracking-[0.35em]">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <NewsletterSignup />
      </div>
    </main>
  );
}
