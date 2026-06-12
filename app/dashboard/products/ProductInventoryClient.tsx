'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import { useToast } from '@/components/ToastContext';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Search, List, Grid, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function ProductInventoryClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleDelete = async () => {
    if (!deleteProductId) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteProductId })
      });
      const data = await res.json();
      if (!data.success) {
        notify({ message: data.error || 'Delete failed', variant: 'error' });
      } else {
        notify({ message: 'Product deleted', variant: 'success' });
        router.refresh();
      }
    } catch (err) {
      notify({ message: 'Delete failed', variant: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmationModal
        open={Boolean(deleteProductId)}
        title="Delete product"
        message="This action cannot be undone. Do you want to permanently delete this product?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onCancel={() => setDeleteProductId(null)}
        onConfirm={handleDelete}
      />
      
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50 placeholder:text-text-muted"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border bg-surface p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-full p-2 transition-colors ${viewMode === 'list' ? 'bg-border-subtle text-gold' : 'text-text-muted hover:text-text-primary'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-full p-2 transition-colors ${viewMode === 'grid' ? 'bg-border-subtle text-gold' : 'text-text-muted hover:text-text-primary'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
          <Link
            href="/dashboard/products/new"
            className="rounded-full bg-gold px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all hover:bg-gold/90 hover:shadow-sm"
          >
            Add Product
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-border bg-surface py-16 text-center">
          <p className="font-serif text-xl text-text-primary">No products found</p>
          <p className="mt-2 text-sm text-text-muted">Try adjusting your search query.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product._id} className="group flex flex-col rounded-[1.75rem] border border-border-subtle bg-surface overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:border-gold/30">
              <div className="aspect-[4/3] bg-background relative">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-80" />
                )}
                {product.inventory < 20 && (
                  <span className="absolute top-4 right-4 rounded-full bg-[#D96B6B] px-3 py-1 text-[9px] font-bold tracking-widest text-[#0A0A0A] uppercase shadow-sm">
                    Low Stock
                  </span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-text-primary line-clamp-1">{product.name}</h3>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-text-muted">{product.category}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider">Price</p>
                      <p className="mt-1 text-sm font-medium text-gold">₦{Number(product.price ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted uppercase tracking-wider">Inventory</p>
                      <p className={`mt-1 text-sm font-medium ${product.inventory < 20 ? 'text-[#D96B6B]' : 'text-text-primary'}`}>{product.inventory} units</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2 border-t border-border-subtle pt-4">
                  <Link href={`/dashboard/products/${product._id}/edit`} className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-surface border border-border-subtle py-2 text-xs font-medium text-text-primary hover:bg-border-subtle hover:text-gold transition">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button onClick={() => setDeleteProductId(product._id)} className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-surface border border-border-subtle py-2 text-xs font-medium text-[#D96B6B] hover:bg-[#D96B6B]/10 transition">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-border-subtle bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-primary">
              <thead className="border-b border-border bg-surface text-[10px] uppercase tracking-[0.2em] text-text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium text-right">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Inventory</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="transition-colors hover:bg-surface">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-background border border-border">
                           {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />}
                        </div>
                        <div className="font-serif text-base">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{product.category}</td>
                    <td className="px-6 py-4 text-right text-gold">₦{Number(product.price ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.inventory < 20 ? 'bg-[#D96B6B]/10 text-[#D96B6B]' : 'bg-surface border border-border-subtle text-text-primary'
                      }`}>
                        {product.inventory}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/products/${product.slug}`} className="p-2 text-text-muted hover:text-gold transition-colors rounded-lg hover:bg-border-subtle">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/products/${product._id}/edit`} className="p-2 text-text-muted hover:text-gold transition-colors rounded-lg hover:bg-border-subtle">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteProductId(product._id)} className="p-2 text-text-muted hover:text-[#D96B6B] transition-colors rounded-lg hover:bg-[#D96B6B]/10">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
