import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-slate-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(168,85,247,0.12)]">
            <span className="text-xl font-semibold uppercase tracking-[0.35em] text-white">J</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white">JOJOSCENTSATION</p>
            <p className="text-[11px] uppercase tracking-[0.45em] text-slate-400">FUTURE FRAGRANCE</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/products" className="transition hover:text-accent-300">Shop</Link>
          <Link href="/#why" className="transition hover:text-accent-300">Why</Link>
          <Link href="/#testimonials" className="transition hover:text-accent-300">Reviews</Link>
          <Link href="/#contact" className="transition hover:text-accent-300">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 uppercase tracking-[0.25em] text-slate-100 transition hover:border-accent-300 hover:text-accent-300 md:inline-flex">
            Cart
          </Link>
          {session ? (
            <>
              <span className="hidden rounded-full bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-slate-100 md:inline-flex">
                {session.user?.name ?? session.user?.email}
              </span>
              <Link href="/dashboard" className="rounded-full bg-accent-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-accent-400">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden transition hover:text-accent-300 md:inline-flex">Login</Link>
              <Link href="/signup" className="rounded-full bg-accent-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-accent-400">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
