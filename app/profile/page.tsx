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
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Profile</h1>
        <p className="mt-4 text-slate-600">Log in to view your account details.</p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          Login
        </Link>
      </div>
    );
  }

  const firstName = getFirstName(session.user.name, session.user.email);
  const stats = session.user.email ? await getProfileStats(session.user.email) : null;

  return (
    <div className="bg-[#F8F5EF]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-[2rem] border border-[#E8DDCB] bg-white px-5 py-6 shadow-[0_18px_45px_rgba(76,60,38,0.08)] sm:px-7 sm:py-8">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D6B98C]">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#2D2D2D] sm:text-4xl">Welcome back, {firstName}</h1>
          <p className="mt-3 text-sm leading-7 text-[#61584D]">Your JoJoScentSation account details are shown below.</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-5 shadow-[0_14px_38px_rgba(76,60,38,0.07)] sm:p-7">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8A7B67]">Name</p>
            <p className="mt-3 break-words text-xl font-semibold text-[#2D2D2D] sm:text-2xl">{session.user.name ?? 'Not provided'}</p>
          </section>
          <section className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-5 shadow-[0_14px_38px_rgba(76,60,38,0.07)] sm:p-7">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8A7B67]">Email</p>
            <p className="mt-3 break-words text-xl font-semibold text-[#2D2D2D] sm:text-2xl">{session.user.email ?? 'Not provided'}</p>
          </section>
          <section className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-5 shadow-[0_14px_38px_rgba(76,60,38,0.07)] sm:p-7">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8A7B67]">Orders placed</p>
            <p className="mt-3 text-2xl font-semibold text-[#2D2D2D]">{stats?.orderCount ?? 0}</p>
          </section>
          <section className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-5 shadow-[0_14px_38px_rgba(76,60,38,0.07)] sm:p-7">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8A7B67]">Member since</p>
            <p className="mt-3 text-2xl font-semibold text-[#2D2D2D]">{stats?.createdAt ?? 'Recently joined'}</p>
          </section>
        </div>
        <div className="mt-5 rounded-[1.75rem] border border-[#ECE1D2] bg-[#FCFAF6] p-5 shadow-[0_12px_32px_rgba(76,60,38,0.05)] sm:p-7">
          <p className="text-xs uppercase tracking-[0.35em] text-[#B99867]">Boutique Membership</p>
          <p className="mt-3 text-sm leading-7 text-[#61584D]">
            Your account keeps your orders, checkout details, and fragrance shopping experience connected across the boutique.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/orders"
              className="inline-flex rounded-full bg-[#D6B98C] px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80]"
            >
              View orders
            </Link>
            <Link
              href="/products"
              className="inline-flex rounded-full border border-[#E3D3BA] bg-white px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#F4EBDD]"
            >
              Browse perfumes
            </Link>
            <span className="inline-flex rounded-full border border-[#E3D3BA] bg-white px-5 py-3 text-sm font-semibold capitalize text-[#8A7B67]">
              {stats?.role ?? 'customer'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
