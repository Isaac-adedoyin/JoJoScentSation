import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import getClient from '@/lib/mongodb';

async function getDashboardStats() {
  const client = await getClient();
  const db = client.db();
  const [products, orders, users] = await Promise.all([
    db.collection('products').countDocuments(),
    db.collection('orders').countDocuments(),
    db.collection('users').countDocuments()
  ]);

  return { products, orders, users };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getDashboardStats();

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-slate-700">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="mt-4">Please log in to view the admin dashboard.</p>
      </div>
    );
  }

  const isAdmin = session.user?.role === 'admin' || session.user?.role === 'manager';

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-3 text-slate-600">Manage products, orders and inventory for JoJoScentSation.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Products</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.products}</p>
          <Link href="/dashboard/products" className="mt-6 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Manage catalog
          </Link>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Orders</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.orders}</p>
          <Link href="/dashboard/orders" className="mt-6 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            View orders
          </Link>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-700">Customers</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.users}</p>
          <p className="mt-4 text-sm text-slate-600">Role-based access for admins and managers.</p>
        </div>
      </div>

      {!isAdmin && (
        <div className="mt-10 rounded-3xl bg-yellow-50 p-8 text-slate-900 shadow-sm">
          <p className="font-semibold">Notice</p>
          <p className="mt-2 text-slate-600">You are signed in, but only admin and manager users can manage inventory and orders.</p>
        </div>
      )}
    </div>
  );
}
