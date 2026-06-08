import { NextResponse } from 'next/server';
import getClient from '@/lib/mongodb';

const sampleProducts = [
  {
    name: 'Velvet Blossom Eau de Parfum',
    slug: 'velvet-blossom',
    description: 'A lush floral blend with a powdery amber finish.',
    price: 22000,
    inventory: 52,
    category: 'Floral',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
    cloudinaryPublicId: 'sample',
    featured: true
  },
  {
    name: 'Midnight Oud Intense',
    slug: 'midnight-oud-intense',
    description: 'Dark woods, smoked frankincense, and warm amber.',
    price: 28000,
    inventory: 37,
    category: 'Oriental',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
    cloudinaryPublicId: 'sample',
    featured: true
  },
  {
    name: 'Citrus Mist',
    slug: 'citrus-mist',
    description: 'Fresh bergamot, green tea, and a bright citrus trail.',
    price: 18000,
    inventory: 76,
    category: 'Citrus',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
    cloudinaryPublicId: 'sample'
  }
];

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ success: false, message: 'Missing MONGODB_URI environment variable' }, { status: 500 });
  }

  const client = await getClient();
  const db = client.db();
  const count = await db.collection('products').countDocuments();
  if (count > 0) {
    return NextResponse.json({ success: true, message: 'Existing products present. Skipping seed.' });
  }

  await db.collection('products').insertMany(
    sampleProducts.map((product) => ({ ...product, createdAt: new Date() }))
  );

  return NextResponse.json({ success: true, message: 'Seed data inserted.' });
}
