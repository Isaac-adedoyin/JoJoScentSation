import type { Db, ObjectId } from 'mongodb';
import { slugify } from '@/lib/slug';

type ProductSlugRecord = {
  _id: ObjectId;
  name?: string;
  slug?: string;
};

function buildUniqueSlug(baseSlug: string, usedSlugs: Set<string>): string {
  let candidate = baseSlug;
  let index = 2;

  while (usedSlugs.has(candidate)) {
    candidate = `${baseSlug}-${index}`;
    index += 1;
  }

  usedSlugs.add(candidate);
  return candidate;
}

export async function normalizeProductSlugs(db: Db): Promise<void> {
  const products = await db
    .collection<ProductSlugRecord>('products')
    .find({}, { projection: { _id: 1, name: 1, slug: 1 } })
    .sort({ createdAt: 1, _id: 1 })
    .toArray();

  const usedSlugs = new Set<string>();
  const bulkUpdates = [];

  for (const product of products) {
    const baseSlug = slugify(String(product.slug ?? product.name ?? ''));
    if (!baseSlug) {
      continue;
    }

    const nextSlug = buildUniqueSlug(baseSlug, usedSlugs);
    if (product.slug !== nextSlug) {
      bulkUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { slug: nextSlug } }
        }
      });
    }
  }

  if (bulkUpdates.length > 0) {
    await db.collection('products').bulkWrite(bulkUpdates);
  }
}

export async function resolveUniqueProductSlug(
  db: Db,
  rawSlug: string,
  excludeId?: ObjectId
): Promise<string> {
  const baseSlug = slugify(rawSlug);
  if (!baseSlug) {
    return '';
  }

  let candidate = baseSlug;
  let index = 2;

  while (true) {
    const existing = await db.collection('products').findOne(
      excludeId
        ? { slug: candidate, _id: { $ne: excludeId } }
        : { slug: candidate },
      { projection: { _id: 1 } }
    );

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${index}`;
    index += 1;
  }
}
