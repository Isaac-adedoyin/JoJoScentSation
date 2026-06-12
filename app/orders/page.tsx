import { getServerSession } from 'next-auth';
import Link from 'next/link';
import type { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/nextauth';
import getClient from '@/lib/mongodb';
import type { Order } from '@/lib/types';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'] as const;

function getStatusIndex(status: Order['status']) {
  if (status === 'cancelled') return -1;
  return statusSteps.indexOf(status as (typeof statusSteps)[number]);
}

async function getOrdersForEmail(email: string): Promise<Order[]> {
  const client = await getClient();
  const db = client.db();
  const orders = await db
    .collection<Order & { _id: ObjectId; createdAt: Date | string; userId?: string | null }>('orders')
    .find({ customerEmail: email })
    .sort({ createdAt: -1 })
    .toArray();

  return orders.map((order) => {
    const createdAtValue = order.createdAt as Date | string;

    return {
      ...order,
      _id: order._id.toString(),
      userId: order.userId ?? '',
      createdAt:
        createdAtValue instanceof Date
          ? createdAtValue.toISOString()
          : new Date(createdAtValue).toISOString()
    };
  });
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Your orders</h1>
        <p className="mt-4 text-slate-600">Log in to view your recent purchases and delivery status.</p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          Login
        </Link>
      </div>
    );
  }

  const orders = await getOrdersForEmail(session.user.email);

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-[2rem] border border-border bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Account Orders</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">Your fragrance orders</h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">Track every purchase placed with {session.user.email} in a cleaner boutique-style summary.</p>
        </div>

        <div className="mt-6 space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <article key={order._id} className="rounded-[1.75rem] border border-border-subtle bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gold">{order.status}</p>
                  <h2 className="mt-2 text-xl font-semibold text-text-primary">{order.customerName}</h2>
                  <p className="mt-2 text-sm text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Total</p>
                  <p className="mt-2 text-xl font-semibold text-text-primary sm:text-2xl">₦{order.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-5 rounded-[1.5rem] border border-border-subtle bg-surface p-4">
                {order.status === 'cancelled' ? (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#8D544A]">Order status</p>
                    <p className="text-sm leading-6 text-[#77433A]">This order has been cancelled. Contact support if you need help with a replacement or refund.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs uppercase tracking-[0.35em] text-text-muted">Order progress</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {statusSteps.map((step, index) => {
                        const currentIndex = getStatusIndex(order.status);
                        const isActive = currentIndex >= index;

                        return (
                          <div key={step} className="flex items-center gap-3">
                            <span
                              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold uppercase ${
                                isActive
                                  ? 'bg-gold text-text-primary'
                                  : 'border border-border-subtle bg-white text-text-muted'
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className={`text-sm capitalize ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-border bg-surface p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-text-primary">No orders yet</p>
            <p className="mt-3 text-sm leading-7 text-text-muted">Once you complete checkout, your recent orders will appear here.</p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-gold/90"
            >
              Browse perfumes
            </Link>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
