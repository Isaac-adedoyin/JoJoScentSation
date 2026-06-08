import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import getClient from '@/lib/mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'manager')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ success: false, error: 'Missing MONGODB_URI environment variable' }, { status: 500 });
  }

  const client = await getClient();
  const db = client.db();
  const orders = await db.collection('orders').find().sort({ createdAt: -1 }).toArray();
  return NextResponse.json(
    orders.map((order: any) => ({
      ...order,
      _id: order._id.toString()
    }))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { items, total, customerName, customerEmail, shippingAddress, paystackReference, paid } = body;

  if (!items || !customerName || !customerEmail || !shippingAddress || !total || !paystackReference) {
    return NextResponse.json({ success: false, error: 'Missing order data' }, { status: 400 });
  }

  const client = await getClient();
  const db = client.db();
  const order = {
    userId: null,
    customerName,
    customerEmail,
    items,
    total,
    shippingAddress,
    status: 'processing',
    paid: Boolean(paid),
    paystackReference,
    createdAt: new Date()
  };

  await db.collection('orders').insertOne(order);

  const { ObjectId } = await import('mongodb');
  for (const item of items) {
    await db.collection('products').updateOne(
      { _id: new ObjectId(item.productId) },
      { $inc: { inventory: -item.quantity } }
    );
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'manager')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status } = body;
  if (!id || !status) return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });

  const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });

  const { ObjectId } = await import('mongodb');
  const client = await getClient();
  const db = client.db();

  await db.collection('orders').updateOne({ _id: new ObjectId(id) }, { $set: { status } });

  return NextResponse.json({ success: true });
}
