import getClient from '@/lib/mongodb';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  const client = await getClient();
  const db = client.db();
  const products = await db
    .collection<Product & { _id: ObjectId }>('products')
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  const normalizedProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(),
    price: Number(product.price ?? 0),
    inventory: Number(product.inventory ?? 0)
  } as Product));
  return normalizedProducts;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-[#F8F5EF]">
      <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-8 rounded-[2rem] border border-[#E8DDCB] bg-white px-7 py-8 shadow-[0_18px_45px_rgba(76,60,38,0.08)] flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#B99867]">Gift-ready fragrance</p>
          <h1 className="mt-2 text-4xl font-semibold text-[#2D2D2D]">Browse our perfume catalog</h1>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[#61584D]">
          Every scent is backed by product inventory management, easy checkout, and a clean admin dashboard.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      </div>
    </div>
  );
}
