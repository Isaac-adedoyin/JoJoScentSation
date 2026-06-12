import Link from 'next/link';
import getClient from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ArrowUpRight, Package, ShoppingCart, Users, AlertCircle } from 'lucide-react';

async function getDashboardStats() {
  const client = await getClient();
  const db = client.db();
  
  const [productsCount, ordersCount, usersCount, recentOrders, lowStockProducts] = await Promise.all([
    db.collection('products').countDocuments(),
    db.collection('orders').countDocuments(),
    db.collection('users').countDocuments(),
    db.collection('orders').find().sort({ createdAt: -1 }).limit(5).toArray(),
    db.collection('products').find({ inventory: { $lt: 20 } }).limit(5).toArray()
  ]);

  // Calculate some fake revenue based on orders for the demo
  const totalRevenue = recentOrders.reduce((sum, order) => sum + (order.total || 0), 0) * 12;

  return { 
    counts: { products: productsCount, orders: ordersCount, users: usersCount },
    revenue: totalRevenue || 1250000, // fallback if no orders
    recentOrders,
    lowStockProducts
  };
}

export default async function DashboardPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect('/products');
  }

  const stats = await getDashboardStats();
  const firstName = session.user?.name?.trim()?.split(/\s+/)[0] ?? 'Admin';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-[2rem] border border-border-subtle bg-surface px-5 py-6 shadow-sm sm:px-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">JoJoScentSation Command Center</p>
            <h1 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-text-primary sm:text-5xl">Welcome back, {firstName}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">
              Oversee your boutique's performance. Review recent orders, monitor low-stock inventory, and manage your catalog with peak efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: `₦${(stats.revenue / 100).toLocaleString()}`, icon: ArrowUpRight, color: 'text-[#4ade80]' },
          { label: 'Active Orders', value: stats.counts.orders, icon: ShoppingCart, color: 'text-text-primary' },
          { label: 'Total Products', value: stats.counts.products, icon: Package, color: 'text-text-primary' },
          { label: 'Registered Users', value: stats.counts.users, icon: Users, color: 'text-text-primary' },
        ].map((kpi, i) => (
          <div key={i} className="group rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/30">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.35em] text-text-muted">{kpi.label}</p>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
            <p className="mt-4 font-serif text-3xl text-gold">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <div className="rounded-[1.75rem] border border-border-subtle bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-primary flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D96B6B]" />
              Low Stock Alerts
            </h2>
            <Link href="/dashboard/products" className="text-[10px] uppercase tracking-[0.2em] text-gold hover:underline">View All</Link>
          </div>
          <div className="mt-4 divide-y divide-[#2A2A2A]">
            {stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map(product => (
                <div key={product._id.toString()} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{product.name}</p>
                    <p className="text-xs text-text-muted">{product.category}</p>
                  </div>
                  <span className="rounded-full bg-[#D96B6B]/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-[#D96B6B]">
                    {product.inventory} LEFT
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-text-muted">All products are well stocked.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-[1.75rem] border border-border-subtle bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-primary flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-text-muted" />
              Recent Orders
            </h2>
            <Link href="/dashboard/orders" className="text-[10px] uppercase tracking-[0.2em] text-gold hover:underline">View All</Link>
          </div>
          <div className="mt-4 divide-y divide-[#2A2A2A]">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map(order => (
                <div key={order._id.toString()} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Order #{order._id.toString().slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-primary">₦{(order.total / 100).toLocaleString()}</p>
                    <span className="text-[10px] uppercase tracking-wider text-gold">{order.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-text-muted">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
