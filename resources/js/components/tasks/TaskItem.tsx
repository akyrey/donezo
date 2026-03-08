import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, CalendarCheck, Folder, Trash2, ArrowRight, Sun } from 'lucide-react';
import type { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from '@/components/ui/Tooltip';
import { MarkdownContent } from './MarkdownContent';
import { useCompleteTaskMutation, useDeleteTaskMutation } from '@/hooks/useTasks';

interface TaskItemProps {
    task: Task;
    onSelect?: (task: Task) => void;
    showProject?: boolean;
}

export function TaskItem({ task, onSelect, showProject = false }: TaskItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const completeMutation = useCompleteTaskMutation();
    const deleteMutation = useDeleteTaskMutation();

    const isCompleted = task.status === 'completed';

    function handleComplete(e: React.MouseEvent) {
        e.stopPropagation();
        if (!isCompleted) {
            setIsCompleting(true);
            setTimeout(() => {
                completeMutation.mutate(
                    { id: task.id, completed: true },
                    {
                        onSuccess: () => {
                            window.dispatchEvent(
                                new CustomEvent('task-completed', {
                                    detail: { id: task.id, title: task.title },
                                }),
                            );
                        },
                    },
                );
            }, 350);
        } else {
            completeMutation.mutate({ id: task.id, completed: false });
        }
    }

    function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        deleteMutation.mutate(task.id);
    }

    return (
        <div
            className={cn(
                'group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-150',
                'hover:bg-bg-secondary',
                'cursor-pointer',
                'animate-task-slide-in',
                isCompleted && 'opacity-50',
                isCompleting && 'animate-task-complete',
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect?.(task)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(task);
                }
            }}
        >
            {/* Checkbox */}
            <div className="mt-0.5" onClick={handleComplete}>
                <Checkbox
                    checked={isCompleted}
                    className="cursor-pointer"
                />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div
                    className={cn(
                        'text-sm font-medium text-text',
                        isCompleted && 'line-through text-text-tertiary',
                    )}
                >
                    <MarkdownContent content={task.title} inline />
                </div>

                {/* Metadata row */}
                <div className="mt-1 flex items-center gap-2 text-xs text-text-tertiary">
                    {task.scheduled_at && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.scheduled_at), 'MMM d')}
                        </span>
                    )}

                    {task.deadline_at && (
                        <span className="flex items-center gap-1 text-warning">
                            <Calendar className="h-3 w-3" />
                            Due {format(new Date(task.deadline_at), 'MMM d')}
                        </span>
                    )}

                    {task.is_evening && (
                        <span className="flex items-center gap-1">
                            <Sun className="h-3 w-3" />
                            Evening
                        </span>
                    )}

                    {showProject && task.project_id && (
                        <span className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            Project
                        </span>
                    )}

                    {/* Tag pills */}
                    {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                            {task.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium"
                                    style={{
                                        backgroundColor: tag.color || '#9ca3af',
                                        color: '#fff',
                                    }}
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {task.checklist_items && task.checklist_items.length > 0 && (
                        <span className="text-text-tertiary">
                            {task.checklist_items.filter((i) => i.is_completed).length}
                            /{task.checklist_items.length}
                        </span>
                    )}

                    {task.google_calendar_event_id && (
                        <TooltipProvider delayDuration={300}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="flex items-center gap-1 text-primary/70">
                                        <CalendarCheck className="h-3 w-3" />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>Synced to Google Calendar</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {/* Assignee avatar */}
                    {task.assignee && (
                        <span
                            className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-medium text-primary"
                            title={`Assigned to ${task.assignee.name}`}
                        >
                            {task.assignee.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                        </span>
                    )}
                </div>
            </div>

            {/* Quick actions - always rendered to avoid layout shift, visible on hover */}
            {!isCompleted && (
                <TooltipProvider delayDuration={300}>
                    <div className={cn('flex items-center gap-0.5', !isHovered && 'invisible')}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-text-tertiary hover:text-text"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect?.(task);
                                    }}
                                >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Open</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-text-tertiary hover:text-danger"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            )}
        </div>
    );
}
