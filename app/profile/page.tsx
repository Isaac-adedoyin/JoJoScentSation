import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/nextauth';
import getClient from '@/lib/mongodb';

async function getProfileStats(email: string) {
  const client = await getClient();
  const db = client.db();
  const [user, orderCount] = await Promise.all([
    db.collection('users').findOne<{ createdAt?: Date | string; role?: string }>({ email }),
    db.collection('orders').countDocuments({ customerEmail: email })
  ]);

  return {
    createdAt: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : null,
    role: user?.role ?? 'customer',
    orderCount
  };
}

function getFirstName(name?: string | null, email?: string | null) {
  if (name && name.trim()) {
    return name.trim().split(/\s+/)[0];
  }

  if (email && email.trim()) {
    return email.trim().split('@')[0];
  }

  return 'there';
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-serif text-3xl text-text-primary sm:text-4xl">Profile</h1>
        <p className="mt-4 text-text-muted">Log in to view your account details.</p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-full bg-gold px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition hover:bg-gold/90"
        >
          Login
        </Link>
      </div>
    );
  }

  const firstName = getFirstName(session.user.name, session.user.email);
  const stats = session.user.email ? await getProfileStats(session.user.email) : null;

  return (
    <div className="bg-background text-text-primary">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-[2rem] border border-border-subtle bg-surface px-5 py-6 shadow-sm sm:px-7 sm:py-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Profile</p>
          <h1 className="mt-2 font-serif text-3xl tracking-[-0.03em] text-text-primary sm:text-4xl">Welcome back, {firstName}</h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">Your JoJoScentSation account details are shown below.</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-[1.75rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-7">
            <p className="text-[10px] uppercase tracking-[0.35em] text-text-muted">Name</p>
            <p className="mt-3 break-words font-serif text-xl text-text-primary sm:text-2xl">{session.user.name ?? 'Not provided'}</p>
          </section>
          <section className="rounded-[1.75rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-7">
            <p className="text-[10px] uppercase tracking-[0.35em] text-text-muted">Email</p>
            <p className="mt-3 break-words font-serif text-xl text-text-primary sm:text-2xl">{session.user.email ?? 'Not provided'}</p>
          </section>
          <section className="rounded-[1.75rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-7">
            <p className="text-[10px] uppercase tracking-[0.35em] text-text-muted">Orders placed</p>
            <p className="mt-3 font-serif text-2xl text-gold">{stats?.orderCount ?? 0}</p>
          </section>
          <section className="rounded-[1.75rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-7">
            <p className="text-[10px] uppercase tracking-[0.35em] text-text-muted">Member since</p>
            <p className="mt-3 font-serif text-2xl text-text-primary">{stats?.createdAt ?? 'Recently joined'}</p>
          </section>
        </div>
        <div className="mt-5 rounded-[1.75rem] border border-border-subtle bg-surface p-5 sm:p-7">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Boutique Membership</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            Your account keeps your orders, checkout details, and fragrance shopping experience connected across the boutique.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/orders"
              className="inline-flex rounded-full bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition hover:bg-gold/90"
            >
              View orders
            </Link>
            <Link
              href="/products"
              className="inline-flex rounded-full border border-border bg-surface px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted transition hover:border-gold/40 hover:text-gold"
            >
              Browse perfumes
            </Link>
            <span className="inline-flex items-center rounded-full border border-border bg-background px-5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              {stats?.role ?? 'customer'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
