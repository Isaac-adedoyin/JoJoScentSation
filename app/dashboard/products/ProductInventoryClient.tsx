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
      {products.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-[#DCC8A7] bg-[#FCFAF6] p-8 text-center shadow-[0_12px_32px_rgba(76,60,38,0.05)]">
          <p className="text-lg font-semibold text-[#2D2D2D]">No products yet</p>
          <p className="mt-3 text-sm leading-7 text-[#61584D]">
            Add your first fragrance listing to start building the storefront catalog.
          </p>
          <Link
            href="/dashboard/products/new"
            className="mt-6 inline-flex rounded-full bg-[#D6B98C] px-6 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80]"
          >
            Create product
          </Link>
        </div>
      ) : (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="rounded-[1.75rem] border border-[#ECE1D2] bg-white p-5 shadow-[0_14px_38px_rgba(76,60,38,0.07)] sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-[#2D2D2D] break-words">{product.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#61584D]">{product.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#554E45]">
                <span className="rounded-full border border-[#EFE5D8] bg-[#FCFAF6] px-3 py-1.5">Stock: {product.inventory}</span>
                <span className="rounded-full border border-[#E3D3BA] bg-[#F8F1E6] px-3 py-1.5 text-[#9A7643]">₦{Number(product.price ?? 0).toLocaleString()}</span>
                <span className="rounded-full border border-[#EFE5D8] bg-[#FCFAF6] px-3 py-1.5">{product.category}</span>
                <Link href={`/products/${product.slug}`} className="w-full rounded-full bg-[#D6B98C] px-4 py-2 text-center text-[#2D2D2D] transition hover:bg-[#CDAE80] sm:w-auto">
                  View
                </Link>
                <Link href={`/dashboard/products/${product._id}/edit`} className="w-full rounded-full border border-[#E3D3BA] bg-[#FBF8F2] px-4 py-2 text-center transition hover:bg-[#F4EBDD] sm:w-auto">
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteProductId(product._id)}
                  className="w-full rounded-full bg-[#8D544A] px-4 py-2 text-white transition hover:bg-[#77433A] sm:w-auto"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </>
  );
}
