import React from 'react';
import { ToastMessage } from '../../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const getStyle = () => {
          switch (toast.type) {
            case 'success':
              return {
                bg: 'bg-emerald-600 text-white',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />,
              };
            case 'warning':
              return {
                bg: 'bg-amber-600 text-white',
                icon: <AlertTriangle className="w-5 h-5 text-amber-100 shrink-0" />,
              };
            case 'error':
              return {
                bg: 'bg-rose-600 text-white',
                icon: <AlertCircle className="w-5 h-5 text-rose-100 shrink-0" />,
              };
            case 'info':
            default:
              return {
                bg: 'bg-slate-900 text-white',
                icon: <Info className="w-5 h-5 text-sky-300 shrink-0" />,
              };
          }
        };

        const { bg, icon } = getStyle();

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl ${bg} transition-all duration-300 transform translate-y-0`}
            role="alert"
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 text-sm">
              {toast.title && <div className="font-semibold text-white/95 mb-0.5">{toast.title}</div>}
              <div className="text-white/90 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/70 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
