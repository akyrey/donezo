import React from 'react';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    Folder,
    Sun,
    Bell,
    Tag as TagIcon,
    CheckSquare,
} from 'lucide-react';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
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

    const hasMetadata =
        !!task.scheduled_at ||
        !!task.deadline_at ||
        task.is_evening ||
        !!task.project_id ||
        !!task.completed_at;

    return (
        <div className={cn('space-y-5 pb-6', className)}>
            {/* Header — title + completion checkbox */}
            <div className="flex items-start gap-4">
                <span className="mt-1 shrink-0">
                    <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() =>
                            completeMutation.mutate({
                                id: task.id,
                                completed: !isCompleted,
                            })
                        }
                        className="h-6 w-6 cursor-pointer"
                        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                    <h2
                        className={cn(
                            'text-xl font-semibold leading-snug text-text',
                            isCompleted && 'line-through text-text-tertiary',
                        )}
                    >
                        <MarkdownContent content={task.title} inline />
                    </h2>
                    {isCompleted && (
                        <p className="mt-1 text-xs text-text-tertiary">Completed</p>
                    )}
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <div className="rounded-xl border border-border bg-bg-secondary/50 px-4 py-3">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                        Notes
                    </p>
                    <div className="prose prose-sm max-w-none text-sm text-text-secondary">
                        <MarkdownContent content={task.description} />
                    </div>
                </div>
            )}

            {/* Metadata */}
            {hasMetadata && (
                <div className="rounded-xl border border-border bg-bg-secondary/50 px-4 py-3">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                        Details
                    </p>
                    <div className="space-y-2.5">
                        {task.scheduled_at && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                </span>
                                <div>
                                    <p className="text-xs text-text-tertiary">Scheduled</p>
                                    <p className="font-medium text-text">
                                        {format(new Date(task.scheduled_at), 'EEEE, MMMM d, yyyy')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {task.deadline_at && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                                    <Clock className="h-3.5 w-3.5 text-warning" />
                                </span>
                                <div>
                                    <p className="text-xs text-text-tertiary">Deadline</p>
                                    <p className="font-medium text-text">
                                        {format(new Date(task.deadline_at), 'EEEE, MMMM d, yyyy')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {task.is_evening && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary">
                                    <Sun className="h-3.5 w-3.5 text-text-secondary" />
                                </span>
                                <div>
                                    <p className="text-xs text-text-tertiary">Time of day</p>
                                    <p className="font-medium text-text">Evening</p>
                                </div>
                            </div>
                        )}

                        {task.project_id && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary">
                                    <Folder className="h-3.5 w-3.5 text-text-secondary" />
                                </span>
                                <div>
                                    <p className="text-xs text-text-tertiary">Project</p>
                                    <p className="font-medium text-text">#{task.project_id}</p>
                                </div>
                            </div>
                        )}

                        {task.completed_at && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-success/10">
                                    <Clock className="h-3.5 w-3.5 text-success" />
                                </span>
                                <div>
                                    <p className="text-xs text-text-tertiary">Completed</p>
                                    <p className="font-medium text-text">
                                        {format(new Date(task.completed_at), 'MMM d, yyyy h:mm a')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="rounded-xl border border-border bg-bg-secondary/50 px-4 py-3">
                    <div className="mb-3 flex items-center gap-2">
                        <TagIcon className="h-3.5 w-3.5 text-text-tertiary" />
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                            Tags
                        </p>
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
            )}

            {/* Checklist */}
            {task.checklist_items && task.checklist_items.length > 0 && (
                <div className="rounded-xl border border-border bg-bg-secondary/50 px-4 py-3">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="h-3.5 w-3.5 text-text-tertiary" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                                Checklist
                            </p>
                        </div>
                        <span className="text-xs tabular-nums text-text-tertiary">
                            {task.checklist_items.filter((i) => i.is_completed).length}
                            &thinsp;/&thinsp;{task.checklist_items.length}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-bg-tertiary">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{
                                width: `${
                                    task.checklist_items.length > 0
                                        ? (task.checklist_items.filter((i) => i.is_completed).length /
                                              task.checklist_items.length) *
                                          100
                                        : 0
                                }%`,
                            }}
                        />
                    </div>

                    <div className="space-y-1">
                        {task.checklist_items
                            .sort((a, b) => a.position - b.position)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-bg-tertiary"
                                    onClick={() =>
                                        onToggleChecklistItem?.(task.id, item.id, !item.is_completed)
                                    }
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
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span
                                        className={cn(
                                            'text-sm text-text',
                                            item.is_completed && 'line-through text-text-tertiary',
                                        )}
                                    >
                                        {item.title}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Reminders */}
            {task.reminders && task.reminders.length > 0 && (
                <div className="rounded-xl border border-border bg-bg-secondary/50 px-4 py-3">
                    <div className="mb-3 flex items-center gap-2">
                        <Bell className="h-3.5 w-3.5 text-text-tertiary" />
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                            Reminders
                        </p>
                    </div>
                    <div className="space-y-2">
                        {task.reminders.map((reminder) => (
                            <div
                                key={reminder.id}
                                className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm"
                            >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Bell className="h-3 w-3 text-primary" />
                                </span>
                                <span className="text-text-secondary">
                                    {format(new Date(reminder.remind_at), 'MMM d, yyyy h:mm a')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
