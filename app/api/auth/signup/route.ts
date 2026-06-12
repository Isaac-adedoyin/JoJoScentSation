import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import getClient from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/resend';

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

  const adminEmail = process.env.ADMIN_EMAIL;
  const role = (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) ? 'admin' : 'customer';
  // Admin bypasses email verification initially for bootstrapping
  const isAutoVerified = role === 'admin';

  const passwordHash = await hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.collection('users').insertOne({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    emailVerified: isAutoVerified,
    verificationToken: isAutoVerified ? null : verificationToken,
    verificationTokenExpires: isAutoVerified ? null : verificationTokenExpires,
    createdAt: new Date()
  });

  if (!isAutoVerified) {
    try {
      await sendVerificationEmail(email.toLowerCase(), verificationToken);
    } catch (e) {
      console.error('Failed to send verification email', e);
      // We don't want to fail the signup completely if the email fails, but in a real app we might.
      // For now, we continue.
    }
  }

  return NextResponse.json({ success: true });
}
