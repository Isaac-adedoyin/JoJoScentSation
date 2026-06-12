import getClient from '@/lib/mongodb';
import type { Order } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import OrderManagementClient from './OrderManagementClient';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getOrders(): Promise<Order[]> {
  const client = await getClient();
  const db = client.db();
  const orders = await db
    .collection<Order & { _id: ObjectId }>('orders')
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return orders.map((order) => ({
    ...order,
    _id: order._id.toString()
  }));
}

export default async function DashboardOrdersPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect('/products');
  }

  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-border-subtle bg-surface px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Dashboard</p>
          <h1 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-text-primary sm:text-4xl">Orders</h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            Review customer purchases, manage fulfillment, and instantly update delivery status.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <OrderManagementClient orders={orders} />
      </div>
    </div>
  );
}
