import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/nextauth';

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
        <h1 className="text-4xl font-semibold text-slate-900">Profile</h1>
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

  return (
    <div className="bg-[#F8F5EF]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-[2rem] border border-[#E8DDCB] bg-white px-7 py-8 shadow-[0_18px_45px_rgba(76,60,38,0.08)]">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D6B98C]">Profile</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[#2D2D2D]">Welcome back, {firstName}</h1>
          <p className="mt-3 text-sm leading-7 text-[#61584D]">Your JoJoScentSation account details are shown below.</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-7 shadow-[0_14px_38px_rgba(76,60,38,0.07)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[#8A7B67]">Name</p>
          <p className="mt-3 text-2xl font-semibold text-[#2D2D2D]">{session.user.name ?? 'Not provided'}</p>
        </section>
        <section className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-7 shadow-[0_14px_38px_rgba(76,60,38,0.07)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[#8A7B67]">Email</p>
          <p className="mt-3 text-2xl font-semibold text-[#2D2D2D]">{session.user.email ?? 'Not provided'}</p>
        </section>
        </div>
        <div className="mt-5 rounded-[1.75rem] border border-[#ECE1D2] bg-[#FCFAF6] p-7 shadow-[0_12px_32px_rgba(76,60,38,0.05)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[#B99867]">Boutique Membership</p>
          <p className="mt-3 text-sm leading-7 text-[#61584D]">
            Your account keeps your orders, checkout details, and fragrance shopping experience connected across the boutique.
          </p>
        </div>
      </div>
    </div>
  );
}
