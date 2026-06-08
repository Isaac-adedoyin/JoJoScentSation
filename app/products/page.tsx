import getClient from '@/lib/mongodb';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';

async function getProducts(): Promise<Product[]> {
  const client = await getClient();
  const db = client.db();
  const products = await db
    .collection<Product & { _id: ObjectId }>('products')
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return products.map((product) => ({
    ...product,
    _id: product._id.toString()
  } as Product));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Gift-ready fragrance</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">Browse our perfume catalog</h1>
        </div>
        <p className="max-w-xl text-sm text-slate-600">
          Every scent is backed by product inventory management, easy checkout, and a clean admin dashboard.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
