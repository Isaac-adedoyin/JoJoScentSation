import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-brand-700">
          JoJoScentSation
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-700">
          <Link href="/products" className="hover:text-brand-600">Shop</Link>
          <Link href="/cart" className="hover:text-brand-600">Cart</Link>
          {session ? (
            <>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-700">{session.user?.name ?? session.user?.email}</span>
              <Link href="/dashboard" className="hover:text-brand-600">Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand-600">Login</Link>
              <Link href="/signup" className="rounded-md bg-brand-600 px-3 py-2 text-white hover:bg-brand-700">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
