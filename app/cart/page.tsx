'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold text-[#2D2D2D] sm:text-4xl">Your cart is empty</h1>
        <p className="mt-4 text-[#61584D]">Add some fragrance to your collection before checkout.</p>
        <Link href="/products" className="mt-8 inline-flex rounded-full bg-[#D6B98C] px-6 py-3 text-[#2D2D2D] transition hover:bg-[#CDAE80]">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.7fr_0.8fr]">
        <section className="space-y-6 rounded-[2rem] border border-[#E8DDCB] bg-white p-5 shadow-[0_18px_45px_rgba(76,60,38,0.08)] sm:p-8">
          <h1 className="text-3xl font-semibold text-[#2D2D2D]">Shopping cart</h1>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="grid gap-4 rounded-[1.5rem] border border-[#EFE5D8] bg-[#FCFAF6] p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(130px,0.5fr)_minmax(110px,0.5fr)_90px] md:items-center">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[#2D2D2D] break-words">{item.name}</h2>
                    <p className="text-sm text-[#61584D]">₦{item.price.toLocaleString()} each</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#61584D]">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    className="mt-2 w-full rounded-2xl border border-[#E3D3BA] bg-white px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:text-right">
                  <p className="text-sm text-[#8A7B67]">Total</p>
                  <p className="mt-2 text-xl font-semibold text-[#2D2D2D]">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="w-full rounded-full border border-[#E3D3BA] bg-white px-4 py-2 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#F4EBDD] md:w-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-[#E8DDCB] bg-white p-5 shadow-[0_18px_45px_rgba(76,60,38,0.08)] sm:p-8">
          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#B99867]">Order summary</p>
              <p className="mt-3 text-3xl font-semibold text-[#2D2D2D]">₦{subtotal.toLocaleString()}</p>
            </div>
            <Link href="/checkout" className="block rounded-full bg-[#D6B98C] px-6 py-4 text-center text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80]">
              Checkout with Paystack
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="w-full rounded-full border border-[#E3D3BA] px-6 py-4 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#F4EBDD]"
            >
              Clear cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
