import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import getClient from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ success: false, error: 'Missing token or password' }, { status: 400 });
    }

    const client = await getClient();
    const db = client.db();

    const user = await db.collection('users').findOne({ resetPasswordToken: token });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (user.resetPasswordTokenExpires && new Date() > new Date(user.resetPasswordTokenExpires)) {
      return NextResponse.json({ success: false, error: 'Reset token has expired' }, { status: 400 });
    }

    const passwordHash = await hash(password, 10);

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: { passwordHash },
        $unset: { resetPasswordToken: "", resetPasswordTokenExpires: "" }
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
