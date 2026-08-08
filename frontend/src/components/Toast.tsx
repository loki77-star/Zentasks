'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let toastsList: ToastItem[] = [];

export const showToast = (message: string, type: ToastType = 'success') => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { id, message, type };
  toastsList = [...toastsList, newToast];
  toastListeners.forEach(listener => listener(toastsList));

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toastsList = toastsList.filter(t => t.id !== id);
    toastListeners.forEach(listener => listener(toastsList));
  }, 4000);
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastItem[]) => {
      setToasts(newToasts);
    };
    toastListeners.push(listener);
    setToasts(toastsList);

    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border pointer-events-auto animate-slide-up transition-all duration-300 ${
              isSuccess
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-50 dark:border-emerald-900'
                : isError
                ? 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950 dark:text-rose-50 dark:border-rose-900'
                : 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-50 dark:border-blue-900'
            }`}
          >
            {isSuccess && <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />}
            {isError && <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 flex-shrink-0 text-blue-500" />}
            
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            
            <button
              onClick={() => {
                toastsList = toastsList.filter(t => t.id !== toast.id);
                toastListeners.forEach(listener => listener(toastsList));
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
