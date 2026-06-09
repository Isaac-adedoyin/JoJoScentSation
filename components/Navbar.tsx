'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import CartNavButton from '@/components/CartNavButton';
import LogoutButton from '@/components/LogoutButton';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = session?.user?.role;
  const isAdmin = role === 'admin';
  const isAuthenticated = Boolean(session);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8DDCB] bg-[#FBF8F2]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-[#2D2D2D] sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo mode="compact" className="min-w-0" />

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

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && !isAdmin ? <CartNavButton /> : null}
            {isAuthenticated ? (
              <LogoutButton className="rounded-full border border-[#E3D3BA] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2D2D2D] transition hover:bg-[#F4EBDD]" />
            ) : (
              <>
                <Link href="/login" className="transition hover:text-[#B99867]">Login</Link>
                <Link href="/signup" className="rounded-full bg-[#D6B98C] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2D2D2D] transition hover:bg-[#CDAE80]">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex items-center rounded-full border border-[#E3D3BA] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2D2D2D] md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {mobileOpen ? (
          <div className="mt-4 space-y-3 rounded-[1.5rem] border border-[#E8DDCB] bg-white p-4 shadow-[0_18px_45px_rgba(76,60,38,0.08)] md:hidden">
            <Link href="/" onClick={closeMobileMenu} className="block rounded-2xl px-3 py-2 transition hover:bg-[#F4EBDD]">Shop</Link>
            <Link href="/products" onClick={closeMobileMenu} className="block rounded-2xl px-3 py-2 transition hover:bg-[#F4EBDD]">Products</Link>
            {isAuthenticated && !isAdmin ? <Link href="/cart" onClick={closeMobileMenu} className="block rounded-2xl px-3 py-2 transition hover:bg-[#F4EBDD]">Cart</Link> : null}
            {isAuthenticated && isAdmin ? <Link href="/dashboard/orders" onClick={closeMobileMenu} className="block rounded-2xl px-3 py-2 transition hover:bg-[#F4EBDD]">Orders</Link> : null}
            {isAuthenticated && isAdmin ? <Link href="/dashboard" onClick={closeMobileMenu} className="block rounded-2xl px-3 py-2 transition hover:bg-[#F4EBDD]">Admin</Link> : null}
            {isAuthenticated ? <Link href="/profile" onClick={closeMobileMenu} className="block rounded-2xl px-3 py-2 transition hover:bg-[#F4EBDD]">Profile</Link> : null}
            {!isAuthenticated ? <Link href="/login" onClick={closeMobileMenu} className="block rounded-2xl px-3 py-2 transition hover:bg-[#F4EBDD]">Login</Link> : null}
            {!isAuthenticated ? <Link href="/signup" onClick={closeMobileMenu} className="block rounded-2xl bg-[#D6B98C] px-3 py-2 text-center font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80]">Sign Up</Link> : null}
            {isAuthenticated ? <LogoutButton className="w-full rounded-2xl border border-[#E3D3BA] bg-[#FBF8F2] px-3 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#F4EBDD]" /> : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
