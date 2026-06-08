import Link from 'next/link';
import getClient from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
  const session = await requireAdmin();

  if (!session) {
    redirect('/products');
  }

  const stats = await getDashboardStats();

  const firstName = session.user?.name?.trim()?.split(/\s+/)[0] ?? 'Collector';

  return (
    <div className="bg-[#F8F5EF]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[2rem] border border-[#E8DDCB] bg-white px-7 py-8 shadow-[0_18px_45px_rgba(76,60,38,0.08)] md:px-10">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D6B98C]">JoJoScentSation Atelier</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-[-0.03em] text-[#2D2D2D]">Welcome back, {firstName}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5B5449]">
                Oversee your perfume boutique with a calmer, more luxurious control room for catalog updates,
                customer demand, and order flow.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <Link
                href="/dashboard/products"
                className="inline-flex justify-center rounded-full bg-[#D6B98C] px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80]"
              >
                Manage catalog
              </Link>
              <Link
                href="/dashboard/orders"
                className="inline-flex justify-center rounded-full border border-[#E3D3BA] bg-[#FBF8F2] px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#F4EBDD]"
              >
                Review orders
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-7 shadow-[0_14px_38px_rgba(76,60,38,0.07)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#B99867]">Products</p>
            <p className="mt-4 text-4xl font-semibold text-[#2D2D2D]">{stats.products}</p>
            <p className="mt-3 text-sm leading-6 text-[#61584D]">Every scent currently available in your boutique lineup.</p>
            <Link href="/dashboard/products" className="mt-5 inline-flex rounded-full bg-[#2D2D2D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#454545]">
              Inventory overview
            </Link>
          </div>
          <div className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-7 shadow-[0_14px_38px_rgba(76,60,38,0.07)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#B99867]">Orders</p>
            <p className="mt-4 text-4xl font-semibold text-[#2D2D2D]">{stats.orders}</p>
            <p className="mt-3 text-sm leading-6 text-[#61584D]">Customer purchases that need tracking, updates, and delivery follow-through.</p>
            <Link href="/dashboard/orders" className="mt-5 inline-flex rounded-full bg-[#2D2D2D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#454545]">
              Order activity
            </Link>
          </div>
          <div className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-7 shadow-[0_14px_38px_rgba(76,60,38,0.07)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#B99867]">Customers</p>
            <p className="mt-4 text-4xl font-semibold text-[#2D2D2D]">{stats.users}</p>
            <p className="mt-3 text-sm leading-6 text-[#61584D]">Registered clients who return for signature fragrances and boutique service.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-7 shadow-[0_14px_38px_rgba(76,60,38,0.07)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#B99867]">Boutique Notes</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#2D2D2D]">A premium workspace for fragrance operations</h2>
            <p className="mt-3 text-sm leading-7 text-[#61584D]">
              Keep your boutique presentation polished while updating stock, pricing, and customer fulfillment in one place.
              The experience stays lighter and more refined, but the admin controls are unchanged.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[#E8DDCB] bg-[#FCFAF6] p-7 shadow-[0_14px_38px_rgba(76,60,38,0.06)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#B99867]">Access</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#2D2D2D]">Management access enabled</h2>
            <p className="mt-3 text-sm leading-7 text-[#61584D]">
              You can manage inventory, review orders, and maintain the storefront catalog from this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
