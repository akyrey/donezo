import React from 'react';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    Folder,
    Sun,
    Bell,
    Tag as TagIcon,
} from 'lucide-react';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { MarkdownContent } from './MarkdownContent';
import { useCompleteTaskMutation } from '@/hooks/useTasks';

interface TaskDetailProps {
    task: Task;
    className?: string;
    onToggleChecklistItem?: (taskId: number, itemId: number, completed: boolean) => void;
}

export function TaskDetail({
    task,
    className,
    onToggleChecklistItem,
}: TaskDetailProps) {
    const completeMutation = useCompleteTaskMutation();

    const isCompleted = task.status === 'completed';

    return (
        <div className={cn('space-y-5', className)}>
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="mt-1">
                    <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() =>
                            completeMutation.mutate({
                                id: task.id,
                                completed: !isCompleted,
                            })
                        }
                    />
                </div>
                <div className="flex-1">
                    <h2
                        className={cn(
                            'text-lg font-semibold text-text',
                            isCompleted &&
                                'line-through text-text-tertiary',
                        )}
                    >
                        <MarkdownContent content={task.title} inline />
                    </h2>
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <>
                    <Separator />
                    <div className="pl-8">
                        <MarkdownContent content={task.description} />
                    </div>
                </>
            )}

            {/* Metadata */}
            <Separator />
            <div className="space-y-3 pl-8">
                {task.scheduled_at && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Calendar className="h-4 w-4 text-text-tertiary" />
                        <span>
                            {format(new Date(task.scheduled_at), 'EEEE, MMMM d, yyyy')}
                        </span>
                    </div>
                )}

                {task.deadline_at && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock className="h-4 w-4 text-warning" />
                        <span>
                            Due {format(new Date(task.deadline_at), 'EEEE, MMMM d, yyyy')}
                        </span>
                    </div>
                )}

                {task.is_evening && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Sun className="h-4 w-4 text-text-tertiary" />
                        <span>Evening</span>
                    </div>
                )}

                {task.project_id && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Folder className="h-4 w-4 text-text-tertiary" />
                        <span>Project #{task.project_id}</span>
                    </div>
                )}

                {task.completed_at && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock className="h-4 w-4 text-success" />
                        <span>
                            Completed{' '}
                            {format(
                                new Date(task.completed_at),
                                'MMM d, yyyy h:mm a',
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-2 pl-8">
                        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                            <TagIcon className="h-4 w-4" />
                            Tags
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {task.tags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    color={tag.color ?? undefined}
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Checklist */}
            {task.checklist_items && task.checklist_items.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-2 pl-8">
                        <div className="text-sm font-medium text-text-secondary">
                            Checklist (
                            {task.checklist_items.filter((i) => i.is_completed).length}
                            /{task.checklist_items.length})
                        </div>
                        <div className="space-y-1">
                            {task.checklist_items
                                .sort((a, b) => a.position - b.position)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-bg-secondary"
                                    >
                                        <Checkbox
                                            checked={item.is_completed}
                                            onCheckedChange={() =>
                                                onToggleChecklistItem?.(
                                                    task.id,
                                                    item.id,
                                                    !item.is_completed,
                                                )
                                            }
                                        />
                                        <span
                                            className={cn(
                                                'text-sm text-text',
                                                item.is_completed &&
                                                    'line-through text-text-tertiary',
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </>
            )}

            {/* Reminders */}
            {task.reminders && task.reminders.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-2 pl-8">
                        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                            <Bell className="h-4 w-4" />
                            Reminders
                        </div>
                        <div className="space-y-1">
                            {task.reminders.map((reminder) => (
                                <div
                                    key={reminder.id}
                                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary"
                                >
                                    <Bell className="h-3.5 w-3.5 text-text-tertiary" />
                                    {format(
                                        new Date(reminder.remind_at),
                                        'MMM d, yyyy h:mm a',
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
