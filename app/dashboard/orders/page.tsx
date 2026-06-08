import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import getClient from '@/lib/mongodb';
import type { Order } from '@/lib/types';
import type { ObjectId } from 'mongodb';
import OrderManagementClient from './OrderManagementClient';

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
  const session = await getServerSession(authOptions);
  const orders = await getOrders();

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-slate-700">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="mt-4">Please log in to manage orders.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-3 text-slate-600">Review customer purchases and order status.</p>
      </div>

      <OrderManagementClient orders={orders} />
    </div>
  );
}
