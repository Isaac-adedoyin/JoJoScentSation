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
      return 'border-accent-400/40 bg-[#0c0716]/95 text-slate-100';
    case 'error':
      return 'border-rose-400/40 bg-[#16070c]/95 text-rose-100';
    default:
      return 'border-white/10 bg-[#07070b]/95 text-slate-100';
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            {toast.variant === 'success' ? 'Added' : toast.variant === 'error' ? 'Error' : 'Notice'}
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
