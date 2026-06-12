'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Store } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/users', label: 'Users', icon: Users },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex md:flex-col h-full overflow-x-auto md:sticky md:top-0">
      <div className="hidden md:flex p-6 pb-4 border-b border-border-subtle items-center justify-between">
        <BrandLogo mode="compact" className="min-w-0" />
        <ThemeToggle />
      </div>
      <div className="flex md:flex-col gap-2 p-4 md:p-6 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-border-subtle text-gold shadow-sm border border-border'
                  : 'text-text-muted hover:bg-surface hover:text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden md:inline">{item.label}</span>
              <span className="md:hidden">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="p-4 md:p-6 border-l md:border-l-0 md:border-t border-border-subtle">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-muted hover:bg-surface hover:text-text-muted transition-all whitespace-nowrap"
        >
          <Store className="w-5 h-5" />
          <span className="hidden md:inline">Storefront</span>
          <span className="md:hidden">Storefront</span>
        </Link>
      </div>
    </nav>
  );
}
