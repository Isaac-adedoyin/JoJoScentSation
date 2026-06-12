'use client';

import { CartProvider } from '@/components/CartProvider';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ToastContext';
import { AuthModalProvider } from '@/components/AuthModalProvider';
import AuthModal from '@/components/AuthModal';
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        <ToastProvider>
          <CartProvider>
            {children}
            <AuthModal />
          </CartProvider>
        </ToastProvider>
      </AuthModalProvider>
    </SessionProvider>
  );
}
