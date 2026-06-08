'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

type UserNavProps = {
  name?: string | null;
  email?: string | null;
  role?: 'admin' | 'manager' | 'customer' | null;
};

function getDisplayName(name?: string | null, email?: string | null) {
  if (name && name.trim()) {
    return name.trim().split(/\s+/)[0];
  }

  if (email && email.trim()) {
    return email.trim().split('@')[0];
  }

  return 'Profile';
}

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
  }

  if (email && email.trim()) {
    return email.trim().charAt(0).toUpperCase();
  }

  return 'P';
}

export default function UserNav({ name, email, role }: UserNavProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayName = getDisplayName(name, email);
  const initials = getInitials(name, email);
  const canAccessDashboard = role === 'admin' || role === 'manager';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const menuItemClassName =
    'block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-2 text-left text-slate-100 transition hover:border-accent-300/60 hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-[0_0_30px_rgba(168,85,247,0.25)]">
          {initials}
        </span>
        <span className="hidden pr-3 md:block">
          <span className="block text-[11px] uppercase tracking-[0.35em] text-slate-400">Profile</span>
          <span className="block text-sm font-medium text-white">{displayName}</span>
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-[1.75rem] border border-white/10 bg-[#07070b]/95 p-3 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          role="menu"
        >
          <div className="border-b border-white/10 px-4 pb-3">
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Signed in as</p>
            <p className="mt-2 text-base font-semibold text-white">{displayName}</p>
            {email ? <p className="mt-1 text-sm text-slate-400">{email}</p> : null}
          </div>

          <div className="mt-3 space-y-1">
            {canAccessDashboard ? (
              <Link href="/dashboard" className={menuItemClassName} onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            ) : null}
            <Link href="/orders" className={menuItemClassName} onClick={() => setOpen(false)}>
              Orders
            </Link>
            <Link href="/profile" className={menuItemClassName} onClick={() => setOpen(false)}>
              Profile
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full rounded-2xl px-4 py-3 text-left text-sm text-rose-200 transition hover:bg-rose-500/10 hover:text-rose-100"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
