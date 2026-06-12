'use client';

import { useEffect } from 'react';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        onCancel();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 px-4 py-6 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className="w-full max-w-lg rounded-[2rem] border border-border bg-surface p-6 sm:p-8 shadow-sm"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#D96B6B]">Warning</p>
        <h2 id="confirm-modal-title" className="mt-3 font-serif text-2xl text-text-primary sm:text-3xl">
          {title}
        </h2>
        <p id="confirm-modal-description" className="mt-4 leading-7 text-text-muted">
          {message}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-full border border-border bg-surface px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted transition-colors hover:border-gold/50 hover:text-gold"
            autoFocus
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex justify-center rounded-full bg-[#D96B6B] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#E38585] hover:shadow-sm disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#1E1E1E] disabled:text-text-muted disabled:shadow-none"
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
