'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/components/CartProvider';
import { useToast } from '@/components/ToastContext';

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

export default function CheckoutClient() {
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [name, setName] = useState(session?.user?.name ?? '');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setEmail(session?.user?.email ?? '');
    setName(session?.user?.name ?? '');
  }, [session]);

  const { notify } = useToast();

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
      setStatus('Unable to start payment.');
      notify({ message: 'Unable to start Paystack payment.', variant: 'error' });
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(subtotal * 100),
      reference,
      onClose: () => {
        setStatus('Payment cancelled.');
        notify({ message: 'Payment was cancelled.', variant: 'info' });
      },
      callback: async ({ reference }: { reference: string }) => {
        setStatus('Verifying payment...');
        const verifyRes = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, email, address, name, items, subtotal })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          clearCart();
          setStatus('Payment completed. Order placed successfully.');
          notify({ message: 'Payment completed successfully.', variant: 'success' });
        } else {
          setStatus('Payment verification failed.');
          notify({ message: 'Payment verification failed.', variant: 'error' });
        }
      }
    });
    handler.openIframe();
  };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-4xl font-semibold text-slate-900">Checkout</h1>
        <p className="mt-3 text-slate-600">Secure payment and order placement through Paystack.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_0.5fr]">
          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Shipping address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-500"
                  rows={5}
                />
              </div>
              <button
                type="button"
                onClick={handlePaystack}
                disabled={!items.length || !address || !email || !name}
                className="inline-flex w-full justify-center rounded-full bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Pay ₦{subtotal.toLocaleString()} with Paystack
              </button>
              {status && <p className="text-sm text-slate-600">{status}</p>}
            </div>
          </section>

          <aside className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
              <p className="text-slate-600">Items: {items.length}</p>
              <p className="text-slate-600">Subtotal: ₦{subtotal.toLocaleString()}</p>
              <p className="text-slate-600">Delivery is calculated at checkout.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
