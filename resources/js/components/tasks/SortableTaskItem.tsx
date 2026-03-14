import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'touch-none select-none',
                !isCompleted && 'cursor-grab active:cursor-grabbing',
            )}
            {...attributes}
            {...listeners}
        >
            <TaskItem
                task={task}
                onSelect={onSelect}
                showProject={showProject}
            />
        </div>
    );
}
