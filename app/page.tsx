import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import getClient from '@/lib/mongodb';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';

async function getFeaturedProducts(): Promise<Product[]> {
  const client = await getClient();
  const db = client.db();
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

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
            Perfume, powered by next-gen commerce
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            JoJoScentSation: premium fragrance, built for fast modern retail.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-700">
            Browse curated perfume collections, manage inventory with admin controls, and accept secure payments with Paystack.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700">
              Explore collection
            </Link>
            <Link href="/dashboard" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Admin dashboard
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] bg-gradient-to-br from-brand-100 via-white to-slate-100 p-8 shadow-lg shadow-brand-100">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">Inventory & order management</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-4xl font-semibold text-slate-900">Stock</p>
                <p className="mt-2 text-sm text-slate-600">Track inventory levels in real time.</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-4xl font-semibold text-slate-900">Orders</p>
                <p className="mt-2 text-sm text-slate-600">Review and fulfill customer purchases.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Featured scents</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Most loved perfumes</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
            See all products
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.length > 0 ? (
            featured.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="col-span-full rounded-3xl bg-white p-12 text-center text-slate-600 shadow-sm">
              No products found. Seed the database or add products in the admin dashboard.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
