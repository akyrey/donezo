import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
    /** Duration in ms before the long-press fires. Default: 500 */
    threshold?: number;
    /** Max pointer movement in px before the gesture is cancelled. Default: 10 */
    moveThreshold?: number;
    onLongPress: () => void;
}

interface LongPressHandlers {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
}

/**
 * Returns pointer-event handlers that fire `onLongPress` after the pointer has
 * been held down for `threshold` ms without moving more than `moveThreshold` px.
 *
 * Desktop hover-based interactions are completely unaffected — this only
 * triggers via a sustained pointer-down (i.e. a tap-and-hold on touch devices).
 */
export function useLongPress({
    threshold = 500,
    moveThreshold = 10,
    onLongPress,
}: UseLongPressOptions): LongPressHandlers {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startPosRef = useRef<{ x: number; y: number } | null>(null);
    const firedRef = useRef(false);

    const cancel = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        startPosRef.current = null;
        firedRef.current = false;
    }, []);

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            // Only handle primary pointer (left mouse button / first touch)
            if (e.button !== 0 && e.pointerType === 'mouse') return;

            startPosRef.current = { x: e.clientX, y: e.clientY };
            firedRef.current = false;

            timerRef.current = setTimeout(() => {
                firedRef.current = true;
                timerRef.current = null;
                startPosRef.current = null;
                onLongPress();
            }, threshold);
        },
        [threshold, onLongPress],
    );

    const onPointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!startPosRef.current) return;
            const dx = e.clientX - startPosRef.current.x;
            const dy = e.clientY - startPosRef.current.y;
            if (Math.sqrt(dx * dx + dy * dy) > moveThreshold) {
                cancel();
            }
        },
        [moveThreshold, cancel],
    );

    const onPointerUp = useCallback(() => {
        cancel();
    }, [cancel]);

    const onPointerCancel = useCallback(() => {
        cancel();
    }, [cancel]);

    return { onPointerDown, onPointerUp, onPointerMove, onPointerCancel };
}
