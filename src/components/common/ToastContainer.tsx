import React from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#080808] text-white border border-[#262626] px-4 py-3.5 shadow-lg flex items-start justify-between gap-3 transition-all duration-150"
        >
          <div className="flex items-start gap-2.5">
            {t.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Check className="h-4 w-4 text-white shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider">{t.title}</p>
              {t.description && (
                <p className="text-xs text-[#CCCCCC] mt-1 leading-relaxed">{t.description}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="text-[#777777] hover:text-white transition-colors p-0.5"
            aria-label="Close notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
