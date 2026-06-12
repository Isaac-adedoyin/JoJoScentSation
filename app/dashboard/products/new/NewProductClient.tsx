'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastContext';
import AdminImagePicker from '@/components/AdminImagePicker';
import { slugify } from '@/lib/slug';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function NewProductClient() {
  const router = useRouter();
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Single Upload State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [category, setCategory] = useState('Perfume');
  const [file, setFile] = useState<File | null>(null);
  
  // Interactive Grid Bulk Entry State
  const [gridRows, setGridRows] = useState<any[]>([{ id: Date.now(), name: '', description: '', price: 0, inventory: 0, category: 'Perfume', imageUrl: '', cloudinaryPublicId: '', isUploading: false }]);

  const [loading, setLoading] = useState(false);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      notify({ message: 'Please select an image', variant: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const uploadRes = await fetch('/api/cloudinary/upload', { method: 'POST', body: form });
      const uploadData = await uploadRes.json();
      
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Image upload failed');
      }

      const payload = {
        name,
        slug: slug || slugify(name),
        description,
        price,
        inventory,
        category,
        imageUrl: uploadData.url,
        cloudinaryPublicId: uploadData.publicId
      };

      const res = await fetch('/api/products', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Create failed');
      
      notify({ message: 'Product created successfully', variant: 'success' });
      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      notify({ message: err.message || 'Something went wrong', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGridRow = () => {
    setGridRows([...gridRows, { id: Date.now(), name: '', description: '', price: 0, inventory: 0, category: 'Perfume', imageUrl: '', cloudinaryPublicId: '', isUploading: false }]);
  };

  const handleRemoveGridRow = (id: number) => {
    setGridRows(gridRows.filter(row => row.id !== id));
  };

  const updateGridRow = (id: number, field: string, value: any) => {
    setGridRows(gridRows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleGridImageUpload = async (id: number, file: File) => {
    updateGridRow(id, 'isUploading', true);
    try {
      const form = new FormData();
      form.append('file', file);
      const uploadRes = await fetch('/api/cloudinary/upload', { method: 'POST', body: form });
      const uploadData = await uploadRes.json();
      
      if (uploadData.success) {
        setGridRows(prev => prev.map(row => {
          if (row.id === id) {
            return { ...row, imageUrl: uploadData.url, cloudinaryPublicId: uploadData.publicId, isUploading: false };
          }
          return row;
        }));
      } else {
        throw new Error(uploadData.error || 'Upload failed');
      }
    } catch (err: any) {
      notify({ message: err.message || 'Image upload failed', variant: 'error' });
      updateGridRow(id, 'isUploading', false);
    }
  };

  const handleBulkSubmit = async () => {
    const validProducts = gridRows
      .filter(r => r.name && r.price > 0)
      .map(r => ({
        ...r,
        slug: slugify(r.name)
      }));
    
    if (validProducts.length === 0) {
      notify({ message: 'Please complete at least one row with a Name and Price.', variant: 'error' });
      return;
    }

    if (validProducts.some(r => r.isUploading)) {
      notify({ message: 'Please wait for all images to finish uploading.', variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: validProducts })
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Bulk upload failed');
      
      notify({ message: `Successfully imported ${validProducts.length} products`, variant: 'success' });
      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      notify({ message: err.message || 'Something went wrong', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-border-subtle bg-surface px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Dashboard</p>
          <h1 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-text-primary sm:text-4xl">Add Products</h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            Expand your catalog. Add a single premium fragrance or add multiple using the interactive grid.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-4 border-b border-border-subtle">
          <button
            onClick={() => setActiveTab('single')}
            className={`pb-4 text-sm font-medium tracking-wide transition-colors relative ${
              activeTab === 'single' ? 'text-gold' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Single Upload
            {activeTab === 'single' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-t-full shadow-sm" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`pb-4 text-sm font-medium tracking-wide transition-colors relative ${
              activeTab === 'bulk' ? 'text-gold' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Interactive Bulk Entry
            {activeTab === 'bulk' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-t-full shadow-sm" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'single' && (
        <form onSubmit={handleSingleSubmit} className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Main Details */}
          <div className="rounded-[1.75rem] border border-border-subtle bg-surface p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">Product Name</label>
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
                className="mt-2 w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50"
              />
            </div>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">URL Slug</label>
                <input required value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className="mt-2 w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50" />
              </div>
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">Category</label>
                <input required value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 min-h-[160px] w-full rounded-2xl border border-border bg-surface px-5 py-4 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50" />
            </div>
          </div>

          {/* Media & Pricing */}
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-border-subtle bg-surface p-6 shadow-sm">
              <AdminImagePicker
                required
                file={file}
                onFileChange={setFile}
                label="Product Image"
                helperText="Upload a high-quality square or portrait image."
              />
            </div>
            
            <div className="rounded-[1.75rem] border border-border-subtle bg-surface p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">Price (₦)</label>
                <input required type="number" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50" />
              </div>
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">Initial Inventory</label>
                <input required type="number" min="0" value={inventory} onChange={(e) => setInventory(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50" />
              </div>
            </div>

            <button disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all hover:bg-gold/90 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'bulk' && (
        <div className="rounded-[1.75rem] border border-border-subtle bg-surface p-6 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-primary">Interactive Bulk Entry</h3>
            <div className="flex gap-3">
              <button 
                onClick={handleAddGridRow}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted transition hover:border-gold/50 hover:text-text-primary"
              >
                <Plus className="w-3 h-3" /> Add Row
              </button>
              <button 
                onClick={handleBulkSubmit}
                disabled={loading}
                className="rounded-full bg-gold px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition hover:bg-gold/90 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish All'}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-text-muted">
              <thead className="bg-background text-[10px] uppercase tracking-[0.2em] text-gold">
                <tr>
                  <th className="px-4 py-3 font-semibold w-48">Name</th>
                  <th className="px-4 py-3 font-semibold w-32">Category</th>
                  <th className="px-4 py-3 font-semibold w-24">Price</th>
                  <th className="px-4 py-3 font-semibold w-24">Stock</th>
                  <th className="px-4 py-3 font-semibold min-w-[200px]">Description</th>
                  <th className="px-4 py-3 font-semibold w-32 text-center">Image</th>
                  <th className="px-4 py-3 font-semibold w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {gridRows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-[#1A1A1A]/30">
                    <td className="px-2 py-2">
                      <input 
                        value={row.name} 
                        onChange={(e) => updateGridRow(row.id, 'name', e.target.value)}
                        placeholder="Product name"
                        className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none px-2 py-1 text-text-primary transition-colors"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        value={row.category} 
                        onChange={(e) => updateGridRow(row.id, 'category', e.target.value)}
                        placeholder="Category"
                        className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none px-2 py-1 text-text-primary transition-colors"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        type="number"
                        min="0"
                        value={row.price} 
                        onChange={(e) => updateGridRow(row.id, 'price', Number(e.target.value))}
                        placeholder="Price"
                        className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none px-2 py-1 text-text-primary transition-colors"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        type="number"
                        min="0"
                        value={row.inventory} 
                        onChange={(e) => updateGridRow(row.id, 'inventory', Number(e.target.value))}
                        placeholder="Stock"
                        className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none px-2 py-1 text-text-primary transition-colors"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input 
                        value={row.description} 
                        onChange={(e) => updateGridRow(row.id, 'description', e.target.value)}
                        placeholder="Brief description..."
                        className="w-full bg-transparent border-b border-transparent focus:border-gold outline-none px-2 py-1 text-text-primary transition-colors"
                      />
                    </td>
                    <td className="px-2 py-2 text-center relative">
                      {row.imageUrl && !row.isUploading ? (
                        <div className="relative group inline-block">
                          <img src={row.imageUrl} alt="preview" className="w-10 h-10 object-cover rounded-lg border border-border" />
                          <label className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <ImageIcon className="w-4 h-4 text-gold" />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleGridImageUpload(row.id, file);
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className={`inline-flex items-center justify-center gap-2 rounded-full border border-border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${row.isUploading ? 'bg-surface text-text-muted opacity-50 cursor-not-allowed' : 'bg-surface text-text-muted hover:text-text-primary cursor-pointer hover:border-gold/50'}`}>
                          {row.isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                          {row.isUploading ? 'Up...' : 'Upload'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            disabled={row.isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGridImageUpload(row.id, file);
                            }}
                          />
                        </label>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button 
                        type="button"
                        onClick={() => handleRemoveGridRow(row.id)}
                        className="text-text-muted hover:text-[#D96B6B] transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {gridRows.length === 0 && (
              <div className="text-center py-10 text-text-muted text-sm">
                No rows added. Click "Add Row" to start entering products.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
