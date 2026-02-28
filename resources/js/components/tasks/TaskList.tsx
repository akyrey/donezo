import React from 'react';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { TaskItem } from './TaskItem';
import { Inbox } from 'lucide-react';

interface TaskListProps {
    tasks: Task[];
    title?: string;
    emptyMessage?: string;
    isLoading?: boolean;
    onSelectTask?: (task: Task) => void;
    showProject?: boolean;
    className?: string;
}

function TaskListSkeleton() {
    return (
        <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                >
                    <div className="mt-0.5 h-5 w-5 animate-pulse rounded-full bg-bg-tertiary" />
                    <div className="flex-1 space-y-2">
                        <div
                            className="h-4 animate-pulse rounded bg-bg-tertiary"
                            style={{ width: `${60 + Math.random() * 30}%` }}
                        />
                        <div
                            className="h-3 animate-pulse rounded bg-bg-tertiary"
                            style={{ width: `${30 + Math.random() * 20}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TaskList({
    tasks,
    title,
    emptyMessage = 'No tasks here.',
    isLoading = false,
    onSelectTask,
    showProject = false,
    className,
}: TaskListProps) {
    if (isLoading) {
        return (
            <div className={cn('space-y-1', className)}>
                {title && (
                    <h2 className="mb-2 px-3 text-sm font-semibold text-text-secondary">
                        {title}
                    </h2>
                )}
                <TaskListSkeleton />
            </div>
        );
    }

    return (
        <div className={cn('space-y-0.5', className)}>
            {title && (
                <h2 className="mb-2 px-3 text-sm font-semibold text-text-secondary">
                    {title}
                </h2>
            )}

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
                    <Inbox className="mb-3 h-10 w-10 stroke-1" />
                    <p className="text-sm">{emptyMessage}</p>
                </div>
            ) : (
                tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onSelect={onSelectTask}
                        showProject={showProject}
                    />
                ))
            )}
        </div>
    );
}
