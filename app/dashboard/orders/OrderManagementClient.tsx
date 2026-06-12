'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Order } from '@/lib/types';
import { useToast } from '@/components/ToastContext';
import { Search, Filter, Mail, Package, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function OrderManagementClient({ orders: initialOrders }: { orders: Order[] }) {
  const router = useRouter();
  const { notify } = useToast();
  
  // Local state for optimistic updates
  const [orders, setOrders] = useState(initialOrders);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (updatingId === orderId) return;
    
    // Optimistic UI Update
    setOrders((prev) => 
      prev.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o)
    );
    setUpdatingId(orderId);

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        setOrders(initialOrders);
        notify({ message: data.error || 'Update failed', variant: 'error' });
      } else {
        notify({ message: 'Status updated', variant: 'success' });
        router.refresh();
      }
    } catch (err) {
      setOrders(initialOrders);
      notify({ message: 'Update failed', variant: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-[#7A7060]/10 text-text-muted border-[#7A7060]/20';
      case 'processing': return 'bg-gold/10 text-gold border-gold/20';
      case 'shipped': return 'bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/20';
      case 'delivered': return 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20';
      case 'cancelled': return 'bg-[#D96B6B]/10 text-[#D96B6B] border-[#D96B6B]/20';
      default: return 'bg-[#2A2A2A] text-text-primary border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search orders, customers, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50 placeholder:text-text-muted"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="text-text-muted w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-border bg-surface py-16 text-center">
          <p className="font-serif text-xl text-text-primary">No orders found</p>
          <p className="mt-2 text-sm text-text-muted">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-border-subtle bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-primary">
              <thead className="border-b border-border bg-surface text-[10px] uppercase tracking-[0.2em] text-text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E1E]">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="transition-colors hover:bg-[#1A1A1A]/50">
                    <td className="px-6 py-4 font-mono text-xs text-text-muted">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customerName}</span>
                        <a href={`mailto:${order.customerEmail}`} className="text-xs text-text-muted flex items-center gap-1 hover:text-gold">
                          <Mail className="w-3 h-3" /> {order.customerEmail}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gold">
                      ₦{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-text-muted text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase outline-none transition-colors ${getStatusColor(order.status)} ${updatingId === order._id ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:border-gold/50'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
