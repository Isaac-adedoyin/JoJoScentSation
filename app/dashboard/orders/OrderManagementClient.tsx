'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Order } from '@/lib/types';
import { useToast } from '@/components/ToastContext';

export default function OrderManagementClient({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>(
    orders.reduce((acc, order) => ({ ...acc, [order._id]: order.status }), {})
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, value: string) => {
    setSelectedStatuses((current) => ({ ...current, [orderId]: value }));
  };

  const handleUpdate = async (orderId: string) => {
    const status = selectedStatuses[orderId];
    if (!status) return;

    setSavingId(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status })
      });
      const data = await res.json();
      if (!data.success) {
        notify({ message: data.error || 'Order status update failed', variant: 'error' });
      } else {
        notify({ message: 'Order status updated', variant: 'success' });
        router.refresh();
      }
    } catch (err) {
      notify({ message: 'Order status update failed', variant: 'error' });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-700">{order.status}</p>
              <h2 className="text-xl font-semibold text-slate-900">{order.customerName}</h2>
              <p className="mt-2 text-sm text-slate-600">{order.customerEmail} • {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-sm text-slate-500">Paid: {order.paid ? 'Yes' : 'No'}</p>
              <p className="text-lg font-semibold text-slate-900">₦{order.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Shipping address</p>
            <p className="text-sm text-slate-700">{order.shippingAddress}</p>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <select
              value={selectedStatuses[order._id]}
              onChange={(event) => handleStatusChange(order._id, event.target.value)}
              className="rounded border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              type="button"
              onClick={() => handleUpdate(order._id)}
              disabled={savingId === order._id}
              className="inline-flex justify-center rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {savingId === order._id ? 'Updating...' : 'Update status'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
