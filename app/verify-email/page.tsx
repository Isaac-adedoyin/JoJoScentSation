import getClient from '@/lib/mongodb';
import Link from 'next/link';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token;

  if (!token || typeof token !== 'string') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#D96B6B]">Invalid Link</h1>
          <p className="mt-4 text-text-muted">This verification link is invalid or missing a token.</p>
          <Link href="/" className="mt-8 inline-block text-gold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const client = await getClient();
  const db = client.db();

  const user = await db.collection('users').findOne({ verificationToken: token });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#D96B6B]">Invalid Token</h1>
          <p className="mt-4 text-text-muted">This verification token does not exist or has already been used.</p>
          <Link href="/" className="mt-8 inline-block text-gold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  if (user.verificationTokenExpires && new Date() > new Date(user.verificationTokenExpires)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#D96B6B]">Token Expired</h1>
          <p className="mt-4 text-text-muted">This verification link has expired. Please sign up again or request a new link.</p>
          <Link href="/" className="mt-8 inline-block text-gold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  // Update user
  await db.collection('users').updateOne(
    { _id: user._id },
    {
      $set: { emailVerified: true },
      $unset: { verificationToken: "", verificationTokenExpires: "" }
    }
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="rounded-[2rem] border border-border-subtle bg-surface p-8 text-center shadow-sm sm:p-12">
        <h1 className="font-serif text-3xl text-text-primary">Email Verified!</h1>
        <p className="mt-4 text-text-muted">Your account has been successfully verified.</p>
        <p className="mt-2 text-text-muted">You can now log in using the menu above.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition hover:bg-gold/90">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
