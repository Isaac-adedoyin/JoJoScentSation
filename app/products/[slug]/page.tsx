import type { Product } from '@/lib/types';
import Image from 'next/image';
import getClient from '@/lib/mongodb';
import ProductActions from './ProductActions';
import type { ObjectId } from 'mongodb';
import { normalizeProductSlugs } from '@/lib/product-slugs';
import { slugify } from '@/lib/slug';

export const revalidate = 60;

async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = await getClient();
  const db = client.db();
  await normalizeProductSlugs(db);
  const normalizedSlug = slugify(slug);
  const product = await db
    .collection<Product & { _id: ObjectId }>('products')
    .findOne({ slug: normalizedSlug });
  if (!product) return null;

  return {
    ...product,
    _id: product._id.toString()
  } as Product;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center text-text-primary">
        <h1 className="font-serif text-2xl sm:text-3xl">Product not found</h1>
        <p className="mt-4 text-text-muted">Check the catalog for our available perfume collections.</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-text-primary">
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-surface shadow-sm min-h-[320px] sm:min-h-[460px]">
          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
        </div>
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border-subtle bg-surface p-6 shadow-sm sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">{product.category}</p>
            <h1 className="mt-4 font-serif text-3xl text-text-primary sm:text-4xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-8 text-text-muted">{product.description}</p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-2xl font-semibold text-gold sm:text-3xl">₦{Number(product.price ?? 0).toLocaleString()}</span>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-muted">
                {product.inventory > 0 ? 'Available' : 'Sold out'}
              </span>
            </div>
          </div>
          <ProductActions product={product} />
        </div>
      </div>
    </div>
    </div>
  );
}
