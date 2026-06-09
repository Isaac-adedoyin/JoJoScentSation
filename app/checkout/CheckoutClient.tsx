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
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-semibold text-[#2D2D2D] sm:text-4xl">Checkout</h1>
        <p className="mt-3 text-[#61584D]">Secure payment and order placement through Paystack.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_0.5fr]">
          <section className="rounded-[2rem] border border-[#E8DDCB] bg-white p-5 shadow-[0_18px_45px_rgba(76,60,38,0.08)] sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#2D2D2D]">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 focus:border-[#D6B98C]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2D2D2D]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 focus:border-[#D6B98C]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2D2D2D]">Shipping address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 focus:border-[#D6B98C]"
                  rows={5}
                />
              </div>
              <button
                type="button"
                onClick={handlePaystack}
                disabled={!items.length || !address || !email || !name}
                className="inline-flex w-full justify-center rounded-full bg-[#D6B98C] px-6 py-4 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80] disabled:cursor-not-allowed disabled:bg-[#E5DACA]"
              >
                Pay ₦{subtotal.toLocaleString()} with Paystack
              </button>
              {status && <p className="text-sm text-[#61584D]">{status}</p>}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-[#E8DDCB] bg-white p-5 shadow-[0_18px_45px_rgba(76,60,38,0.08)] sm:p-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#2D2D2D]">Order summary</h2>
              <p className="text-[#61584D]">Items: {items.length}</p>
              <p className="text-[#61584D]">Subtotal: ₦{subtotal.toLocaleString()}</p>
              <p className="text-[#61584D]">Delivery is calculated at checkout.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
