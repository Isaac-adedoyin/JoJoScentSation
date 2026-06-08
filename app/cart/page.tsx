'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold text-slate-900">Your cart is empty</h1>
        <p className="mt-4 text-slate-600">Add some fragrance to your collection before checkout.</p>
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-brand-600 px-6 py-3 text-white transition hover:bg-brand-700">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.7fr_0.8fr]">
        <section className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Shopping cart</h1>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="grid gap-4 rounded-3xl border border-slate-200 p-5 md:grid-cols-[1fr_0.5fr_0.5fr_80px] md:items-center">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                  <div>
                    <h2 className="font-semibold text-slate-900">{item.name}</h2>
                    <p className="text-sm text-slate-600">₦{item.price.toLocaleString()} each</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Order summary</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">₦{subtotal.toLocaleString()}</p>
            </div>
            <Link href="/checkout" className="block rounded-full bg-brand-600 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-brand-700">
              Checkout with Paystack
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="w-full rounded-full border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Clear cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
