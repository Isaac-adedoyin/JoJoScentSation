'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import CartNavButton from '@/components/CartNavButton';
import LogoutButton from '@/components/LogoutButton';
import BrandLogo from '@/components/BrandLogo';
import { useAuthModal } from '@/components/AuthModalProvider';
import ThemeToggle from '@/components/ThemeToggle';

function HamburgerIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
      <rect width="18" height="1.5" rx="0.75" fill="currentColor" />
      <rect y="6.25" width="13" height="1.5" rx="0.75" fill="currentColor" />
      <rect y="12.5" width="18" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="1.5" y1="1.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="1.5" x2="1.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const { openAuthModal } = useAuthModal();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const role = session?.user?.role;
  const isAdmin = role === 'admin';
  const isAuthenticated = Boolean(session);
  const showCart = isAuthenticated;

  const closeMobileMenu = () => setMobileOpen(false);

  const navLinkClass =
    'text-text-muted transition-colors duration-200 hover:text-gold text-[11px] uppercase tracking-[0.28em] font-medium';

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/98 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo mode="compact" className="min-w-0" />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            <Link href="/" className={navLinkClass}>Shop</Link>
            <Link href="/products" className={navLinkClass}>Products</Link>
            {isAdmin && (
              <>
                <Link href="/dashboard" className={navLinkClass}>Admin</Link>
              </>
            )}
            {isAuthenticated && (
              <Link href="/profile" className={navLinkClass}>Profile</Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {showCart && <CartNavButton />}
            {isAuthenticated ? (
              <LogoutButton className="rounded-full border border-border bg-surface px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-text-muted transition-colors hover:border-gold/50 hover:text-gold" />
            ) : (
              <>
                <button onClick={() => openAuthModal('login')} className={navLinkClass}>Login</button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="rounded-full bg-gold px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle & Cart */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            {showCart && <CartNavButton />}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-text-muted transition hover:border-gold/40"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
              <span>{mobileOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="mt-4 space-y-1 rounded-[1.25rem] border border-border-subtle bg-surface p-3 shadow-sm md:hidden">
            {[
              { href: '/', label: 'Shop', show: true },
              { href: '/products', label: 'Products', show: true },
              { href: '/dashboard', label: 'Admin', show: isAdmin },
              { href: '/profile', label: 'Profile', show: isAuthenticated },
            ].filter((item) => item.show).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="block rounded-xl px-4 py-3 text-sm text-text-muted transition hover:bg-[#1A1A1A] hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => { closeMobileMenu(); openAuthModal('login'); }}
                  className="block w-full text-left rounded-xl px-4 py-3 text-sm text-text-muted transition hover:bg-[#1A1A1A] hover:text-gold"
                >
                  Login
                </button>
                <button
                  onClick={() => { closeMobileMenu(); openAuthModal('signup'); }}
                  className="block w-full rounded-xl bg-gold px-4 py-3 text-center text-sm font-semibold text-[#0A0A0A] transition hover:bg-gold/90"
                >
                  Sign Up
                </button>
              </>
            )}
            {isAuthenticated && (
              <LogoutButton className="w-full rounded-xl border border-border px-4 py-3 text-left text-sm text-text-muted transition hover:bg-[#1A1A1A] hover:text-gold" />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
