'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

interface ToastContextValue {
  notify: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function getVariantStyles(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return 'border-[#D6B98C] bg-[#FFFCF8]/95 text-[#2D2D2D]';
    case 'error':
      return 'border-[#D7B8B2] bg-[#FFF8F6]/95 text-[#77433A]';
    default:
      return 'border-[#E8DDCB] bg-white/95 text-[#2D2D2D]';
  }
}

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      className="pointer-events-none fixed right-0 top-0 z-50 flex w-full flex-col items-end gap-3 px-4 pt-4 sm:max-w-md sm:px-6"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-full rounded-[1.75rem] border px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl ${getVariantStyles(toast.variant)}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8A7B67]">
            {toast.variant === 'success' ? 'Success' : toast.variant === 'error' ? 'Error' : 'Notice'}
          </p>
          <p className="mt-2 text-sm leading-6">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useMemo(
    () => (toast: Omit<Toast, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current, { id, ...toast }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
