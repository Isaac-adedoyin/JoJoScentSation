import getClient from '@/lib/mongodb';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import ProductInventoryClient from './ProductInventoryClient';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
  const session = await requireAdmin();

  if (!session) {
    redirect('/products');
  }

  const products = await getProducts();

  return (
    <div className="bg-[#F8F5EF]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] border border-[#E8DDCB] bg-white px-7 py-8 shadow-[0_18px_45px_rgba(76,60,38,0.08)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#D6B98C]">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#2D2D2D]">Product inventory</h1>
              <p className="mt-3 text-sm leading-7 text-[#61584D]">Update stock and review current perfume inventory levels with a lighter boutique-led presentation.</p>
            </div>
            <Link
              href="/dashboard/products/new"
              className="inline-flex justify-center rounded-full bg-[#D6B98C] px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80]"
            >
              Add product
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <ProductInventoryClient products={products} />
        </div>
      </div>
    </div>
  );
}
