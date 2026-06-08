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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2D2D]/25 px-4 py-6 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className="w-full max-w-lg rounded-[1.75rem] border border-[#E8DDCB] bg-white p-6 shadow-[0_24px_70px_rgba(76,60,38,0.14)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-xl font-semibold text-[#2D2D2D]">
          {title}
        </h2>
        <p id="confirm-modal-description" className="mt-3 text-sm leading-6 text-[#61584D]">
          {message}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-full border border-[#E3D3BA] bg-[#FBF8F2] px-5 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#F4EBDD]"
            autoFocus
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex justify-center rounded-full bg-[#8D544A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#77433A] disabled:cursor-not-allowed disabled:bg-[#CFB8B3]"
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
