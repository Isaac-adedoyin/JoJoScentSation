'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center text-text-primary">
        <h1 className="font-serif text-3xl sm:text-4xl">Your cart is empty</h1>
        <p className="mt-4 text-text-muted">Add some fragrance to your collection before checkout.</p>
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 text-text-primary">
      <div className="grid gap-8 lg:grid-cols-[1.7fr_0.8fr]">
        <section className="space-y-6 rounded-[2rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-8">
          <h1 className="font-serif text-3xl text-text-primary">Shopping cart</h1>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="grid gap-4 rounded-[1.5rem] border border-border bg-surface p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(130px,0.5fr)_minmax(110px,0.5fr)_90px] md:items-center transition-all duration-300 hover:border-gold/30 hover:shadow-sm hover:bg-surface">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl">
                    <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-lg text-text-primary break-words">{item.name}</h2>
                    <p className="text-sm text-text-muted">₦{item.price.toLocaleString()} each</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    className="mt-2 w-full rounded-full border border-border bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
                  />
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Total</p>
                  <p className="mt-2 text-xl font-semibold text-gold">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="w-full rounded-full border border-border bg-surface px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted transition-colors hover:border-[#D96B6B]/50 hover:text-[#D96B6B] hover:bg-[#D96B6B]/5 md:w-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-border-subtle bg-surface p-5 shadow-sm sm:p-8">
          <div className="space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Order summary</p>
              <p className="mt-3 text-3xl font-semibold text-text-primary">₦{subtotal.toLocaleString()}</p>
            </div>
            <Link href="/checkout" className="block rounded-full bg-gold px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm">
              Checkout with Paystack
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="w-full rounded-full border border-border bg-surface px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              Clear cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
