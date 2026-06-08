'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CartNavButton from '@/components/CartNavButton';
import LogoutButton from '@/components/LogoutButton';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAdmin = role === 'admin';
  const isAuthenticated = Boolean(session);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8DDCB] bg-[#FBF8F2]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-[#2D2D2D]">
        <BrandLogo mode="compact" />

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="transition hover:text-[#B99867]">Shop</Link>
          <Link href="/products" className="transition hover:text-[#B99867]">Products</Link>
          {isAuthenticated && !isAdmin ? (
            <Link href="/cart" className="transition hover:text-[#B99867]">Cart</Link>
          ) : null}
          {isAuthenticated && isAdmin ? (
            <>
              <Link href="/dashboard/orders" className="transition hover:text-[#B99867]">Orders</Link>
              <Link href="/dashboard" className="transition hover:text-[#B99867]">Admin</Link>
            </>
          ) : null}
          {isAuthenticated ? (
            <Link href="/profile" className="transition hover:text-[#B99867]">Profile</Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && !isAdmin ? <CartNavButton /> : null}
          {isAuthenticated ? (
            <LogoutButton className="rounded-full border border-[#E3D3BA] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#2D2D2D] transition hover:bg-[#F4EBDD]" />
          ) : (
            <>
              <Link href="/login" className="hidden transition hover:text-[#B99867] md:inline-flex">Login</Link>
              <Link href="/signup" className="rounded-full bg-[#D6B98C] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#2D2D2D] transition hover:bg-[#CDAE80]">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
