import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Folder, Trash2, ArrowRight, Sun } from 'lucide-react';
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

    const completeMutation = useCompleteTaskMutation();
    const deleteMutation = useDeleteTaskMutation();

    function handleComplete(e: React.MouseEvent) {
        e.stopPropagation();
        completeMutation.mutate({
            id: task.id,
            is_completed: !task.is_completed,
        });
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
                task.is_completed && 'opacity-50',
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
                    checked={task.is_completed}
                    className="cursor-pointer"
                />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div
                    className={cn(
                        'text-sm font-medium text-text',
                        task.is_completed && 'line-through text-text-tertiary',
                    )}
                >
                    <MarkdownContent content={task.title} inline />
                </div>

                {/* Metadata row */}
                <div className="mt-1 flex items-center gap-2 text-xs text-text-tertiary">
                    {task.due_date && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.due_date), 'MMM d')}
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

                    {/* Tag dots */}
                    {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                            {task.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor: tag.color || '#9ca3af',
                                    }}
                                    title={tag.name}
                                />
                            ))}
                        </div>
                    )}

                    {task.checklist_items && task.checklist_items.length > 0 && (
                        <span className="text-text-tertiary">
                            {task.checklist_items.filter((i) => i.is_completed).length}
                            /{task.checklist_items.length}
                        </span>
                    )}
                </div>
            </div>

            {/* Quick actions - shown on hover */}
            {isHovered && !task.is_completed && (
                <TooltipProvider delayDuration={300}>
                    <div className="flex items-center gap-0.5">
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
