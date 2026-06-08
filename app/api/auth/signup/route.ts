import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import getClient from '@/lib/mongodb';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  const client = await getClient();
  const db = client.db();
  const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);
  await db.collection('users').insertOne({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'customer',
    createdAt: new Date()
  });

  return NextResponse.json({ success: true });
}
