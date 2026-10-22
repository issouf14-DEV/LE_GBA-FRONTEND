import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { ToastContext } from '@/components/common/toast/toastContext';
import { ownValue } from '@/lib/object';
import { cn } from '@/lib/utils';

const ICONS = { success: CheckCircle2, error: AlertCircle, warning: TriangleAlert, info: Info };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = crypto.randomUUID();
      setToasts((list) => [...list, { id, message, type }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      showToast,
      dismiss,
      success: (message, duration) => showToast(message, 'success', duration),
      error: (message, duration) => showToast(message, 'error', duration),
      warning: (message, duration) => showToast(message, 'warning', duration),
      info: (message, duration) => showToast(message, 'info', duration),
    }),
    [showToast, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toaster" aria-live="polite">
        {toasts.map(({ id, message, type }) => {
          const Icon = ownValue(ICONS, type, Info);
          return (
            <div key={id} className={cn('toast', `toast--${type}`)} role="status">
              <Icon className="toast__icon" aria-hidden="true" />
              <p className="toast__message">{message}</p>
              <button
                type="button"
                className="toast__close"
                onClick={() => dismiss(id)}
                aria-label="Fermer"
              >
                <X aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
