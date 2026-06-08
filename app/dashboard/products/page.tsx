import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import getClient from '@/lib/mongodb';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import ProductInventoryClient from './ProductInventoryClient';

async function getProducts(): Promise<Product[]> {
  const client = await getClient();
  const db = client.db();
  const products = await db
    .collection<Product & { _id: ObjectId }>('products')
    .find()
    .sort({ inventory: 1 })
    .toArray();
  return products.map((product) => ({
    ...product,
    _id: product._id.toString()
  }));
}

export default async function DashboardProductsPage() {
  const session = await getServerSession(authOptions);
  const products = await getProducts();

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-slate-700">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="mt-4">Please log in to manage inventory.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Product inventory</h1>
        <p className="mt-3 text-slate-600">Update stock and review current perfume inventory levels.</p>
      </div>

      <ProductInventoryClient products={products} />
    </div>
  );
}
