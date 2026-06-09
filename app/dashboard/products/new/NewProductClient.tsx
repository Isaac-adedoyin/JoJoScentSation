'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastContext';
import AdminImagePicker from '@/components/AdminImagePicker';
import { slugify } from '@/lib/slug';

export default function NewProductClient() {
  const router = useRouter();
  const { notify } = useToast();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [category, setCategory] = useState('Perfume');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!file) return setError('Please select an image');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const uploadRes = await fetch('/api/cloudinary/upload', { method: 'POST', body: form });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        notify({ message: uploadData.error || 'Upload failed', variant: 'error' });
        throw new Error(uploadData.error || 'Upload failed');
      }
      notify({ message: 'Image uploaded successfully', variant: 'success' });

      const payload = {
        name,
        slug,
        description,
        price,
        inventory,
        category,
        imageUrl: uploadData.url,
        cloudinaryPublicId: uploadData.publicId
      };

      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Create failed');
      notify({ message: 'Product created', variant: 'success' });
      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      notify({ message: err.message || 'Something went wrong', variant: 'error' });
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F5EF]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="rounded-[2rem] border border-[#E8DDCB] bg-white px-5 py-6 shadow-[0_18px_45px_rgba(76,60,38,0.08)] sm:px-7 sm:py-8">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D6B98C]">Dashboard</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#2D2D2D] sm:text-3xl">Create product</h1>
          <p className="mt-3 text-sm leading-7 text-[#61584D]">Add a new fragrance listing while keeping the boutique presentation polished and consistent.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-[1.75rem] border border-[#ECE1D2] bg-white p-5 shadow-[0_14px_38px_rgba(76,60,38,0.07)] sm:p-7">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D]">Name</label>
            <input
              required
              value={name}
              onChange={(e) => {
                const nextName = e.target.value;
                const previousAutoSlug = slugify(name);
                setName(nextName);
                if (!slug.trim() || slug === previousAutoSlug) {
                  setSlug(slugify(nextName));
                }
              }}
              className="mt-2 w-full rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 text-[#2D2D2D] outline-none transition focus:border-[#D6B98C]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D]">Slug</label>
            <input required value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className="mt-2 w-full rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 text-[#2D2D2D] outline-none transition focus:border-[#D6B98C]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D]">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 min-h-32 w-full rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 text-[#2D2D2D] outline-none transition focus:border-[#D6B98C]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D]">Price</label>
              <input required type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 text-[#2D2D2D] outline-none transition focus:border-[#D6B98C]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D]">Inventory</label>
              <input required type="number" value={inventory} onChange={(e) => setInventory(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 text-[#2D2D2D] outline-none transition focus:border-[#D6B98C]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D]">Category</label>
            <input required value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-2xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 text-[#2D2D2D] outline-none transition focus:border-[#D6B98C]" />
          </div>
        <div>
          <AdminImagePicker
            required
            file={file}
            onFileChange={setFile}
            label="Image"
            helperText="Upload a product image before creating the listing. Square or portrait images work best in the storefront grid."
          />
        </div>
          <div>
            <button disabled={loading} className="inline-flex items-center rounded-full bg-[#D6B98C] px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80] disabled:bg-[#E5DACA]">
              {loading ? 'Creating...' : 'Create product'}
            </button>
          </div>
          {error && <p className="text-sm text-[#8D544A]">{error}</p>}
          {success && <p className="text-sm text-[#7C6B4F]">{success}</p>}
        </form>
      </div>
    </div>
  );
}
