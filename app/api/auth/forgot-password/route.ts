import { NextResponse } from 'next/server';
import crypto from 'crypto';
import getClient from '@/lib/mongodb';
import { sendPasswordResetEmail } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't leak whether an email exists or not
      return NextResponse.json({ success: true });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken,
          resetPasswordTokenExpires
        }
      }
    );

    try {
      await sendPasswordResetEmail(email.toLowerCase(), resetPasswordToken);
    } catch (e) {
      console.error('Failed to send reset email', e);
      return NextResponse.json({ success: false, error: 'Failed to send reset email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
