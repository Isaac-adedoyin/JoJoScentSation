'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastContext';

export default function EditProductClient({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const prod = data.find((p: any) => p._id === id);
        if (!prod) return setError('Product not found');
        if (!mounted) return;
        setName(prod.name);
        setSlug(prod.slug);
        setDescription(prod.description);
        setPrice(prod.price);
        setInventory(prod.inventory);
        setCategory(prod.category);
        setImageUrl(prod.imageUrl || '');
        setCloudinaryPublicId(prod.cloudinaryPublicId || '');
      } catch (err: any) {
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const { notify } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let newImageUrl = imageUrl;
      let newPublicId = cloudinaryPublicId;
      if (file) {
        const form = new FormData();
        form.append('file', file);
        const uploadRes = await fetch('/api/cloudinary/upload', { method: 'POST', body: form });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          notify({ message: uploadData.error || 'Upload failed', variant: 'error' });
          throw new Error(uploadData.error || 'Upload failed');
        }
        newImageUrl = uploadData.url;
        newPublicId = uploadData.publicId;
        notify({ message: 'Image uploaded successfully', variant: 'success' });
      }

      const payload: any = { id, name, slug, description, price, inventory, category };
      if (file) {
        payload.imageUrl = newImageUrl;
        payload.cloudinaryPublicId = newPublicId;
        payload.prevCloudinaryPublicId = cloudinaryPublicId;
      }

      const res = await fetch('/api/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');
      notify({ message: 'Product updated', variant: 'success' });
      router.push('/dashboard/products');
    } catch (err: any) {
      notify({ message: err.message || 'Save failed', variant: 'error' });
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input required type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Inventory</label>
            <input required type="number" value={inventory} onChange={(e) => setInventory(Number(e.target.value))} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input required value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Replace Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1" />
          {imageUrl && <img src={imageUrl} alt="current" className="mt-2 h-24 w-24 object-cover" />}
        </div>
        <div>
          <button disabled={saving} className="inline-flex items-center rounded bg-brand-600 px-4 py-2 text-white">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
