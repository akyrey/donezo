import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Heading } from '@/types';
import { cn } from '@/lib/utils';

interface SortableHeadingProps {
    heading: Heading;
    taskCount: number;
    /** Rendered inside the sortable wrapper — heading title + collapse trigger + actions */
    children: React.ReactNode;
}

export function SortableHeading({
    heading,
    taskCount: _taskCount,
    children,
}: SortableHeadingProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `heading:${heading.id}`,
        data: { type: 'heading', heading },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className="group/sortable-heading">
            <div className="flex items-center gap-1">
                {/* Drag handle */}
                <button
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className={cn(
                        'flex items-center justify-center p-0.5 text-text-tertiary',
                        'opacity-0 transition-opacity group-hover/sortable-heading:opacity-100',
                        'cursor-grab active:cursor-grabbing',
                        'rounded hover:bg-bg-tertiary',
                        'touch-none select-none',
                    )}
                    aria-label="Drag to reorder heading"
                    tabIndex={-1}
                >
                    <GripVertical className="h-3.5 w-3.5" />
                </button>

                {/* Heading content (trigger + actions) */}
                <div className="min-w-0 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
