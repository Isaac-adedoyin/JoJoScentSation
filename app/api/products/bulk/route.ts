import { NextResponse } from 'next/server';
import getClient from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { products } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid product data provided' }, { status: 400 });
    }

    // Validate and prepare products
    const now = new Date();
    const bulkOps = products.map(p => ({
      name: p.name || 'Unnamed Product',
      slug: p.slug || `unnamed-product-${Math.floor(Math.random() * 10000)}`,
      description: p.description || '',
      price: Number(p.price) || 0,
      inventory: Number(p.inventory) || 0,
      category: p.category || 'Uncategorized',
      imageUrl: p.imageUrl || '',
      createdAt: now,
      updatedAt: now
    }));

    const client = await getClient();
    const db = client.db();

    const result = await db.collection('products').insertMany(bulkOps);

    return NextResponse.json({ 
      success: true, 
      insertedCount: result.insertedCount 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error inserting bulk products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
