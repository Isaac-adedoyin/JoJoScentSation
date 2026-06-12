import { NextResponse } from 'next/server';
import getClient from '@/lib/mongodb';

const realProducts = [
  {
    name: 'Maison Francis Kurkdjian Baccarat Rouge 540',
    slug: 'baccarat-rouge-540',
    description: 'A luminous and sophisticated fragrance featuring amber, floral, and woody notes. A true signature scent.',
    price: 350000,
    inventory: 15,
    category: 'Floral Woody',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    cloudinaryPublicId: 'unsplash-1',
    featured: true
  },
  {
    name: 'Tom Ford Oud Wood',
    slug: 'tom-ford-oud-wood',
    description: 'A pioneering composition of exotic woods and spices. Smoky, incense-filled temples and a passion for rare, precious oud wood inspire it.',
    price: 285000,
    inventory: 8,
    category: 'Woody',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    cloudinaryPublicId: 'unsplash-2',
    featured: true
  },
  {
    name: 'Creed Aventus',
    slug: 'creed-aventus',
    description: 'Celebrating strength, vision and success, inspired by the dramatic life of war, peace and romance lived by Emperor Napoleon.',
    price: 420000,
    inventory: 12,
    category: 'Fruity Chypre',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    cloudinaryPublicId: 'unsplash-3',
    featured: true
  },
  {
    name: 'Yves Saint Laurent Libre',
    slug: 'ysl-libre',
    description: 'The fragrance of freedom, a statement fragrance for those who live by their own rules. A reinvention of the floral perfume.',
    price: 185000,
    inventory: 24,
    category: 'Floral',
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
    cloudinaryPublicId: 'unsplash-4'
  },
  {
    name: 'Dior Sauvage Eau de Parfum',
    slug: 'dior-sauvage',
    description: 'A radically fresh composition, raw and noble all at once. Radiant top notes burst with the juicy freshness of Reggio di Calabria Bergamot.',
    price: 165000,
    inventory: 40,
    category: 'Citrus Spicy',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    cloudinaryPublicId: 'unsplash-5'
  },
  {
    name: 'Chanel Coco Mademoiselle',
    slug: 'chanel-coco-mademoiselle',
    description: 'Irresistibly sexy, irrepressibly spirited. A sparkling oriental fragrance that recalls a daring young Coco Chanel.',
    price: 210000,
    inventory: 18,
    category: 'Oriental',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    cloudinaryPublicId: 'unsplash-6'
  },
  {
    name: 'Byredo Gypsy Water',
    slug: 'byredo-gypsy-water',
    description: 'An ode to the beauty of Romani culture, its unique customs, intimate beliefs and distinguished way of living.',
    price: 260000,
    inventory: 5,
    category: 'Woody Aromatic',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    cloudinaryPublicId: 'unsplash-7',
    featured: true
  },
  {
    name: 'Le Labo Santal 33',
    slug: 'le-labo-santal-33',
    description: 'A perfume that touches the vast and wild universality of the American myth... that intoxicates a man as much as a woman.',
    price: 290000,
    inventory: 14,
    category: 'Woody',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    cloudinaryPublicId: 'unsplash-8'
  }
];

export async function GET(request: Request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ success: false, message: 'Missing MONGODB_URI environment variable' }, { status: 500 });
  }

  const client = await getClient();
  const db = client.db();
  
  // Clear existing products and orders
  await db.collection('products').deleteMany({});
  await db.collection('orders').deleteMany({});

  await db.collection('products').insertMany(
    realProducts.map((product) => ({ ...product, createdAt: new Date() }))
  );

  return NextResponse.json({ success: true, message: 'Data reset successfully. Inserted real products and cleared old orders.' });
}
