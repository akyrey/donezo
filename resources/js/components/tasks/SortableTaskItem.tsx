import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { TaskItem } from './TaskItem';

interface SortableTaskItemProps {
    task: Task;
    onSelect?: (task: Task) => void;
    showProject?: boolean;
}

export function SortableTaskItem({
    task,
    onSelect,
    showProject = false,
}: SortableTaskItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `task:${task.id}`,
        data: { type: 'task', task },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : undefined,
        position: 'relative',
    };

    const isCompleted = task.status === 'completed' || task.status === 'cancelled';

    return (
        <div ref={setNodeRef} style={style} className="group/sortable flex items-stretch">
            {/* Drag handle */}
            <button
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className={cn(
                    'flex items-start justify-center px-1 pt-3 text-text-tertiary',
                    'opacity-0 transition-opacity group-hover/sortable:opacity-100',
                    'cursor-grab active:cursor-grabbing',
                    'rounded-l-lg hover:bg-bg-secondary',
                    'touch-none select-none',
                    isCompleted && 'invisible pointer-events-none',
                )}
                aria-label="Drag to reorder"
                tabIndex={-1}
            >
                <GripVertical className="h-3.5 w-3.5" />
            </button>

            {/* Task content */}
            <div className="min-w-0 flex-1">
                <TaskItem
                    task={task}
                    onSelect={onSelect}
                    showProject={showProject}
                />
            </div>
        </div>
    );
}
