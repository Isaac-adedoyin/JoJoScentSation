import getClient from '@/lib/mongodb';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import ProductInventoryClient from './ProductInventoryClient';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { normalizeProductSlugs } from '@/lib/product-slugs';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  const client = await getClient();
  const db = client.db();
  await normalizeProductSlugs(db);
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
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-border-subtle bg-surface px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Dashboard</p>
          <h1 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-text-primary sm:text-4xl">Product Inventory</h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            Update stock, review current perfume inventory levels, and manage your catalog with peak efficiency.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <ProductInventoryClient products={products} />
      </div>
    </div>
  );
}
