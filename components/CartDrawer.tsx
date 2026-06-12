'use client';

import { useCart } from './CartProvider';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="1.5" y1="1.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="1.5" x2="1.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function CartDrawer() {
  const { items, subtotal, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-surface shadow-sm flex flex-col border-l border-border transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform translate-x-0">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
          <h2 className="font-serif text-2xl text-text-primary">Your Cart</h2>
          <button 
            type="button" 
            onClick={closeCart}
            className="p-2 text-text-muted hover:text-gold transition-colors"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center mt-12">
              <p className="text-text-muted text-sm">Your cart is currently empty.</p>
              <button 
                onClick={closeCart}
                className="mt-6 inline-flex rounded-full border border-border bg-surface px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-4 group">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1rem] border border-border">
                  <Image src={item.imageUrl} alt={item.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div>
                    <h3 className="font-serif text-lg text-text-primary leading-tight">{item.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-gold">₦{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="text-text-muted hover:text-gold px-1"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium text-text-primary w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="text-text-muted hover:text-gold px-1"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-[10px] uppercase tracking-[0.2em] text-text-muted hover:text-[#D96B6B] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-subtle bg-surface px-6 py-6 space-y-5">
            <div className="flex justify-between items-end">
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Subtotal</p>
              <p className="font-serif text-2xl text-gold">₦{subtotal.toLocaleString()}</p>
            </div>
            <p className="text-xs text-text-muted">Shipping and taxes calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="inline-flex w-full justify-center rounded-full bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-sm"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
