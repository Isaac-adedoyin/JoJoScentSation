import getClient from '@/lib/mongodb';
import type { Order } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import OrderManagementClient from './OrderManagementClient';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
    <div className="bg-[#F8F5EF]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-[2rem] border border-[#E8DDCB] bg-white px-5 py-6 shadow-[0_18px_45px_rgba(76,60,38,0.08)] sm:px-7 sm:py-8">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D6B98C]">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#2D2D2D] sm:text-4xl">Orders</h1>
          <p className="mt-3 text-sm leading-7 text-[#61584D]">Review customer purchases and update delivery status in a softer premium workspace.</p>
        </div>

        <div className="mt-6">
          <OrderManagementClient orders={orders} />
        </div>
      </div>
    </div>
  );
}
