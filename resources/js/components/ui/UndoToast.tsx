import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface UndoToastProps {
    message: string;
    duration?: number;
    onUndo: () => void;
    onDismiss: () => void;
}

export function UndoToast({
    message,
    duration = 4000,
    onUndo,
    onDismiss,
}: UndoToastProps) {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Trigger enter animation on mount
        const frame = requestAnimationFrame(() => setVisible(true));

        timerRef.current = setTimeout(() => {
            setVisible(false);
            setTimeout(onDismiss, 300); // wait for exit animation
        }, duration);

        return () => {
            cancelAnimationFrame(frame);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    function handleUndo() {
        if (timerRef.current) clearTimeout(timerRef.current);
        onUndo();
        setVisible(false);
        setTimeout(onDismiss, 300);
    }

    return createPortal(
        <div
            className={cn(
                'fixed bottom-8 left-1/2 z-50 -translate-x-1/2',
                'flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 shadow-lg',
                'transition-all duration-300',
                visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0',
            )}
            role="status"
            aria-live="polite"
        >
            <span className="text-sm text-text">{message}</span>

            <button
                onClick={handleUndo}
                className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
                Undo
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-b-xl">
                <div
                    className="h-full bg-primary origin-left"
                    style={{
                        animation: `shrink ${duration}ms linear forwards`,
                    }}
                />
            </div>
        </div>,
        document.body,
    );
}
