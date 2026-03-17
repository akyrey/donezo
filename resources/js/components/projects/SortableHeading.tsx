import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `heading:${heading.id}`,
    data: { type: 'heading', heading },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('cursor-grab touch-none select-none active:cursor-grabbing')}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
