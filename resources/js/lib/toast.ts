/**
 * Lightweight imperative toast API.
 *
 * Dispatches a custom DOM event that the <ToastRegion> component listens for,
 * so any module can show a toast without prop-drilling or a context provider.
 *
 * Usage:
 *   import { showToast } from '@/lib/toast';
 *   showToast('Saved!', 'success');
 *   showToast('Something went wrong.', 'error');
 */

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastEvent {
  message: string;
  variant: ToastVariant;
  /** Auto-dismiss duration in ms (default 4000) */
  duration?: number;
}

const EVENT_NAME = 'app:toast';

/** Show a toast notification from anywhere in the app. */
export function showToast(message: string, variant: ToastVariant = 'info', duration = 4000): void {
  const event = new CustomEvent<ToastEvent>(EVENT_NAME, {
    detail: { message, variant, duration },
  });
  window.dispatchEvent(event);
}

/** Subscribe to toast events. Returns an unsubscribe function. */
export function onToast(handler: (event: ToastEvent) => void): () => void {
  function listener(e: Event) {
    handler((e as CustomEvent<ToastEvent>).detail);
  }
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
