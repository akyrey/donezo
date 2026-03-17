import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { onToast, type ToastEvent, type ToastVariant } from '@/lib/toast';

// ─── Single toast item ────────────────────────────────────────────────────────

interface ToastItemProps extends ToastEvent {
  id: number;
  onDismiss: (id: number) => void;
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="text-success h-4 w-4 shrink-0" />,
  error: <XCircle className="text-danger h-4 w-4 shrink-0" />,
  info: <Info className="text-primary h-4 w-4 shrink-0" />,
};

const BORDER: Record<ToastVariant, string> = {
  success: 'border-success/30',
  error: 'border-danger/30',
  info: 'border-primary/30',
};

const BAR: Record<ToastVariant, string> = {
  success: 'bg-success',
  error: 'bg-danger',
  info: 'bg-primary',
};

function ToastItem({ id, message, variant, duration = 4000, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on next frame
    const frame = requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(id), 300);
    }, duration);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(() => onDismiss(id), 300);
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'relative flex w-full max-w-sm items-start gap-3 overflow-hidden',
        'bg-bg rounded-xl border px-4 py-3 shadow-lg',
        'transition-all duration-300',
        BORDER[variant],
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      )}
    >
      {ICONS[variant]}

      <p className="text-text flex-1 text-sm">{message}</p>

      <button
        onClick={handleClose}
        className="text-text-tertiary hover:text-text shrink-0 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-b-xl">
        <div
          className={cn('h-full origin-left', BAR[variant])}
          style={{ animation: `shrink ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

// ─── Toast region (rendered once in the layout) ───────────────────────────────

interface ActiveToast extends ToastEvent {
  id: number;
}

let nextId = 0;

/**
 * Mount this once in the authenticated layout. It listens for `showToast()`
 * calls and renders stacked toasts in the bottom-right corner.
 */
export function ToastRegion() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    return onToast((event) => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { ...event, id }]);
    });
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed right-4 bottom-8 z-50 flex flex-col items-end gap-2 sm:right-6"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onDismiss={dismiss} />
      ))}
    </div>,
    document.body,
  );
}
