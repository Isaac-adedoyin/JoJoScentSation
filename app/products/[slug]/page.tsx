import type { Product } from '@/lib/types';
import getClient from '@/lib/mongodb';
import ProductActions from './ProductActions';
import type { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = await getClient();
  const db = client.db();
  const product = await db
    .collection<Product & { _id: ObjectId }>('products')
    .findOne({ slug });
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
      <div className="mx-auto max-w-7xl px-6 py-20 text-center text-slate-700">
        <h1 className="text-3xl font-semibold">Product not found</h1>
        <p className="mt-4">Check the catalog for our available perfume collections.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5EF]">
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#E8DDCB] bg-white shadow-[0_18px_45px_rgba(76,60,38,0.08)]">
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#E8DDCB] bg-white p-8 shadow-[0_18px_45px_rgba(76,60,38,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#B99867]">{product.category}</p>
            <h1 className="mt-4 text-4xl font-semibold text-[#2D2D2D]">{product.name}</h1>
            <p className="mt-5 text-lg leading-8 text-[#61584D]">{product.description}</p>
            <div className="mt-8 flex items-center gap-4">
              <span className="text-3xl font-semibold text-[#9A7643]">₦{Number(product.price ?? 0).toLocaleString()}</span>
              <span className="rounded-full border border-[#EFE5D8] bg-[#FCFAF6] px-3 py-1 text-sm text-[#61584D]">
                {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
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
