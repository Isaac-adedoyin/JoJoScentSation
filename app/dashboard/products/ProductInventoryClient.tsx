'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useToast } from '@/components/ToastContext';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function ProductInventoryClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    <>
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

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{product.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                <span className="rounded-full bg-slate-100 px-3 py-1">Stock: {product.inventory}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-accent-300">₦{Number(product.price ?? 0).toLocaleString()}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{product.category}</span>
                <Link href={`/products/${product.slug}`} className="rounded-full bg-accent-500 px-3 py-1 text-white hover:bg-accent-600">
                  View
                </Link>
                <Link href={`/dashboard/products/${product._id}/edit`} className="rounded-full bg-slate-200 px-3 py-1 hover:bg-slate-300">
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteProductId(product._id)}
                  className="rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
