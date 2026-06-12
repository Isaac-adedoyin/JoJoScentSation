'use client';

import { useEffect, useState } from 'react';

type AdminImagePickerProps = {
  currentImageUrl?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  required?: boolean;
  label: string;
  helperText?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function AdminImagePicker({
  currentImageUrl,
  file,
  onFileChange,
  required = false,
  label,
  helperText
}: AdminImagePickerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      onFileChange(null);
      setError('');
      return;
    }

    if (!selected.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      onFileChange(null);
      event.target.value = '';
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 5MB.');
      onFileChange(null);
      event.target.value = '';
      return;
    }

    setError('');
    onFileChange(selected);
  }

  const activePreview = previewUrl ?? currentImageUrl ?? '';

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">{label}</label>
      <div className="rounded-[1.5rem] border border-dashed border-border bg-background p-5">
        <input
          required={required}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-text-muted file:mr-4 file:rounded-full file:border-0 file:bg-[#1E1E1E] file:px-4 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.2em] file:font-semibold file:text-text-muted file:hover:bg-[#2A2A2A] file:transition"
        />
        <p className="mt-3 text-xs leading-6 text-text-muted">
          {helperText ?? 'Use a sharp product image on a clean background for the best storefront presentation.'}
        </p>
        {error ? <p className="mt-2 text-sm text-[#D96B6B]">{error}</p> : null}
        {activePreview ? (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <img
              src={activePreview}
              alt="Product preview"
              className="h-28 w-28 rounded-[1.25rem] object-cover shadow-sm border border-border-subtle"
            />
            <div className="min-w-0 space-y-2 text-sm text-text-muted">
              <p className="font-medium text-text-primary">{file ? 'New image selected' : 'Current product image'}</p>
              {file ? (
                <>
                  <p className="break-words">{file.name}</p>
                  <p>{Math.round(file.size / 1024)} KB</p>
                </>
              ) : (
                <p>The existing storefront image will remain until you upload a replacement.</p>
              )}
              {file ? (
                <button
                  type="button"
                  onClick={() => onFileChange(null)}
                  className="inline-flex rounded-full border border-border bg-background px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted transition hover:border-gold/40 hover:text-gold sm:tracking-[0.25em]"
                >
                  Remove selection
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
