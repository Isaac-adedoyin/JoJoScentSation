'use client';

import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/ToastContext';

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

export default function CheckoutClient() {
  const { data: session, status } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [name, setName] = useState(session?.user?.name ?? '');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    setEmail(session?.user?.email ?? '');
    setName(session?.user?.name ?? '');
  }, [session]);

  const { notify } = useToast();

  // Auth gate — shown while session is loading or when user is not signed in
  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-text-muted">Loading your session…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-[2rem] border border-border-subtle bg-surface p-8 shadow-sm sm:p-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Almost there</p>
          <h1 className="mt-3 font-serif text-2xl text-text-primary sm:text-3xl">Sign in to complete your order</h1>
          <p className="mt-4 leading-7 text-text-muted">
            Your cart is saved. Please log in or create an account to securely proceed with payment.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login?callbackUrl=/checkout"
              className="rounded-full bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm"
            >
              Log in
            </Link>
            <Link
              href="/signup?callbackUrl=/checkout"
              className="rounded-full border border-border bg-surface px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePaystack = async () => {
    if (!items.length) return;
    const reference = `JOJO-${Date.now()}`;
    const initRes = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: subtotal, email, reference })
    });

    const data = await initRes.json();
    if (!data.status) {
      setPaymentStatus('Unable to start payment.');
      notify({ message: 'Unable to start Paystack payment.', variant: 'error' });
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(subtotal * 100),
      reference,
      onClose: () => {
        setPaymentStatus('Payment cancelled.');
        notify({ message: 'Payment was cancelled.', variant: 'info' });
      },
      callback: async ({ reference }: { reference: string }) => {
        setPaymentStatus('Verifying payment…');
        const verifyRes = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, email, address, name, items, subtotal })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          clearCart();
          setPaymentStatus('Payment completed. Order placed successfully.');
          notify({ message: 'Payment completed successfully.', variant: 'success' });
        } else {
          setPaymentStatus('Payment verification failed.');
          notify({ message: 'Payment verification failed.', variant: 'error' });
        }
      }
    });
    handler.openIframe();
  };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Secure payment</p>
        <h1 className="mt-2 font-serif text-3xl text-text-primary sm:text-4xl">Checkout</h1>
        <p className="mt-3 text-text-muted">Complete your order via Paystack.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_0.5fr]">
          <section className="rounded-[2rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-full border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-full border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted">Shipping address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city, state, postal code"
                  className="mt-2 w-full rounded-3xl border border-border bg-surface px-5 py-4 text-sm text-text-primary placeholder:text-[#5A5040] outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                  rows={4}
                />
              </div>
              <button
                type="button"
                onClick={handlePaystack}
                disabled={!items.length || !address || !email || !name}
                className="inline-flex w-full justify-center rounded-full bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#1E1E1E] disabled:text-text-muted disabled:shadow-none"
              >
                Pay ₦{subtotal.toLocaleString()} with Paystack
              </button>
              {paymentStatus && <p className="text-sm text-gold">{paymentStatus}</p>}
            </div>
          </section>

          {/* Expanded order summary */}
          <aside className="rounded-[2rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-8">
            <h2 className="font-serif text-xl text-text-primary">Order summary</h2>
            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-border">
                    <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-sm text-text-primary">{item.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gold">₦{(item.price * item.quantity).toLocaleString()}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border-subtle pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-muted">Subtotal</p>
                <p className="text-lg font-semibold text-text-primary">₦{subtotal.toLocaleString()}</p>
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-text-muted">Delivery calculated at payment.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
