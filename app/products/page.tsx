import getClient from '@/lib/mongodb';
import ProductsClient from './ProductsClient';
import type { Product } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import { normalizeProductSlugs } from '@/lib/product-slugs';

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  const client = await getClient();
  const db = client.db();
  await normalizeProductSlugs(db);
  const products = await db
    .collection<Product & { _id: ObjectId }>('products')
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return products.map((product) => ({
    ...product,
    _id: product._id.toString(),
    price: Number(product.price ?? 0),
    inventory: Number(product.inventory ?? 0)
  } as Product));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-background text-text-primary">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-border-subtle bg-surface px-5 py-6 shadow-sm sm:px-7 sm:py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Gift-ready fragrance</p>
            <h1 className="mt-2 font-serif text-3xl text-text-primary sm:text-4xl">Browse our perfume catalog</h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-text-muted">
            Explore our curated collection of signature fragrances.
          </p>
        </header>

        <ProductsClient products={products} />
      </div>
    </div>
  );
}
