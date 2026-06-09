import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import getClient from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { normalizeProductSlugs, resolveUniqueProductSlug } from '@/lib/product-slugs';

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ success: false, error: 'Missing MONGODB_URI environment variable' }, { status: 500 });
  }

  const client = await getClient();
  const db = client.db();
  await normalizeProductSlugs(db);
  const products = await db
    .collection('products')
    .find()
    .toArray();
  return NextResponse.json(products.map((product: any) => ({
    ...product,
    _id: product._id.toString()
  })));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, description, price, inventory, category, imageUrl, cloudinaryPublicId } = body;
  const normalizedPrice = Number(price);
  const normalizedInventory = Number(inventory);

  if (
    !String(name ?? '').trim() ||
    !String(description ?? '').trim() ||
    !String(category ?? '').trim() ||
    !String(imageUrl ?? '').trim() ||
    !Number.isFinite(normalizedPrice) ||
    normalizedPrice < 0 ||
    !Number.isFinite(normalizedInventory) ||
    normalizedInventory < 0
  ) {
    return NextResponse.json({ success: false, error: 'Missing product fields' }, { status: 400 });
  }

  const client = await getClient();
  const db = client.db();
  await normalizeProductSlugs(db);
  const normalizedSlug = await resolveUniqueProductSlug(db, String(slug ?? name ?? ''));
  if (!normalizedSlug) {
    return NextResponse.json({ success: false, error: 'Invalid product slug' }, { status: 400 });
  }

  await db.collection('products').insertOne({
    name: String(name).trim(),
    slug: normalizedSlug,
    description: String(description).trim(),
    price: normalizedPrice,
    inventory: normalizedInventory,
    category: String(category).trim(),
    imageUrl: String(imageUrl).trim(),
    cloudinaryPublicId,
    featured: body.featured ?? true,
    createdAt: new Date()
  });

  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath('/dashboard/products');

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ success: false, error: 'Missing product id' }, { status: 400 });

  const { ObjectId } = await import('mongodb');
  const client = await getClient();
  const db = client.db();
  await normalizeProductSlugs(db);

  const updateDoc: any = { ...updates };
  // prevent updating _id
  delete updateDoc._id;
  if ('slug' in updateDoc || 'name' in updateDoc) {
    const normalizedSlug = await resolveUniqueProductSlug(
      db,
      String(updateDoc.slug ?? updateDoc.name ?? ''),
      new ObjectId(id)
    );
    if (!normalizedSlug) {
      return NextResponse.json({ success: false, error: 'Invalid product slug' }, { status: 400 });
    }
    updateDoc.slug = normalizedSlug;
  }

  // if replacing Cloudinary image, optionally remove previous image
  if (updateDoc.cloudinaryPublicId && updateDoc.prevCloudinaryPublicId) {
    try {
      const { v2: cloudinary } = await import('cloudinary');
      await cloudinary.uploader.destroy(updateDoc.prevCloudinaryPublicId, { resource_type: 'image' });
    } catch {
      // continue silently when image cleanup fails
    }
    // remove helper field so it's not saved
    delete updateDoc.prevCloudinaryPublicId;
  }

  await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: updateDoc });

  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath('/dashboard/products');

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ success: false, error: 'Missing product id' }, { status: 400 });

  const { ObjectId } = await import('mongodb');
  const client = await getClient();
  const db = client.db();

  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

  // attempt to delete image from Cloudinary if public id present
  if (product.cloudinaryPublicId) {
    try {
      const { v2: cloudinary } = await import('cloudinary');
      await cloudinary.uploader.destroy(product.cloudinaryPublicId, { resource_type: 'image' });
    } catch {
      // continue silently when image cleanup fails
    }
  }

  await db.collection('products').deleteOne({ _id: new ObjectId(id) });

  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath('/dashboard/products');

  return NextResponse.json({ success: true });
}
