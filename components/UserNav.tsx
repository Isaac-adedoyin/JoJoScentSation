'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

type UserNavProps = {
  name?: string | null;
  email?: string | null;
  role?: 'admin' | 'customer' | null;
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
  const canAccessDashboard = role === 'admin';

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
    'block rounded-2xl px-4 py-3 text-sm text-[#554E45] transition hover:bg-[#FBF8F2] hover:text-[#2D2D2D]';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-3 rounded-full border border-[#E8DDCB] bg-white px-2 py-2 text-left text-[#2D2D2D] shadow-[0_10px_24px_rgba(76,60,38,0.06)] transition hover:border-[#D6B98C] hover:bg-[#FBF8F2]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D6B98C] text-xs font-semibold uppercase tracking-[0.25em] text-[#2D2D2D] shadow-[0_10px_24px_rgba(76,60,38,0.12)]">
          {initials}
        </span>
        <span className="hidden pr-3 md:block">
          <span className="block text-[11px] uppercase tracking-[0.35em] text-[#8A7B67]">Profile</span>
          <span className="block text-sm font-medium text-[#2D2D2D]">{displayName}</span>
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-[1.75rem] border border-[#E8DDCB] bg-[#FFFCF8]/95 p-3 shadow-[0_24px_60px_rgba(76,60,38,0.14)] backdrop-blur-xl"
          role="menu"
        >
          <div className="border-b border-[#EFE5D8] px-4 pb-3">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8A7B67]">Signed in as</p>
            <p className="mt-2 text-base font-semibold text-[#2D2D2D]">{displayName}</p>
            {email ? <p className="mt-1 text-sm text-[#61584D]">{email}</p> : null}
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
              className="block w-full rounded-2xl px-4 py-3 text-left text-sm text-[#8D544A] transition hover:bg-[#F7ECE9] hover:text-[#77433A]"
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
