import { NextResponse } from 'next/server';
import { initializePayment } from '@/lib/paystack';

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, email, reference } = body;

  if (!amount || !email || !reference) {
    return NextResponse.json({ success: false, error: 'Missing payment fields' }, { status: 400 });
  }

  const data = await initializePayment(amount, email, reference);
  return NextResponse.json(data);
}
