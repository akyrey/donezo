import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Pencil, ArrowLeft } from 'lucide-react';
import type { Task, PageProps } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TaskDetail } from './TaskDetail';
import { TaskForm } from './TaskForm';
import { useTagsQuery } from '@/hooks/useTags';

interface TaskDetailDialogProps {
    task: Task | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({
    task,
    open,
    onOpenChange,
}: TaskDetailDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { projects, sections } = usePage<PageProps>().props;
    const { data: tagsResponse } = useTagsQuery();
    const tags = tagsResponse?.data ?? [];

    // Reset to view mode when dialog closes or task changes
    function handleOpenChange(value: boolean) {
        if (!value) {
            setIsEditing(false);
        }
        onOpenChange(value);
    }

    if (!task) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="!grid-rows-none !grid-cols-none !gap-0 !flex flex-col max-w-2xl max-h-[85vh] p-0">
                <DialogHeader className="shrink-0 px-6 pt-6 pb-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="sr-only">
                            {isEditing ? 'Edit Task' : 'Task Details'}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {isEditing
                                ? 'Edit the task details below.'
                                : 'View task details, checklist items, and metadata.'}
                        </DialogDescription>
                        {isEditing ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-text-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-text-secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 pt-4">
                    {isEditing ? (
                        <TaskForm
                            task={task}
                            projects={projects}
                            sections={sections}
                            tags={tags}
                            onClose={() => {
                                setIsEditing(false);
                                handleOpenChange(false);
                            }}
                        />
                    ) : (
                        <TaskDetail task={task} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
