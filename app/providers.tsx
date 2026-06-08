'use client';

import { CartProvider } from '@/components/CartProvider';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <CartProvider>{children}</CartProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
