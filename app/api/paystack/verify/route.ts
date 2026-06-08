import { NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/paystack';
import getClient from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  const body = await request.json();
  const { reference, email, name, address, items, subtotal } = body;

  if (!reference || !email || !name || !address || !items || !subtotal) {
    return NextResponse.json({ success: false, error: 'Missing request body' }, { status: 400 });
  }

  const verification = await verifyPayment(reference);
  if (!verification?.status || verification.data.status !== 'success') {
    return NextResponse.json({ success: false, error: 'Payment failed to verify' }, { status: 402 });
  }

  const client = await getClient();
  const db = client.db();

  await db.collection('orders').insertOne({
    userId: null,
    customerName: name,
    customerEmail: email,
    items,
    total: subtotal,
    shippingAddress: address,
    status: 'completed',
    paid: true,
    paystackReference: reference,
    createdAt: new Date()
  });

  for (const item of items) {
    await db.collection('products').updateOne(
      { _id: new ObjectId(item.productId) },
      { $inc: { inventory: -item.quantity } }
    );
  }

  return NextResponse.json({ success: true });
}
