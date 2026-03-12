import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Pencil, ArrowLeft } from 'lucide-react';
import type { Task, PageProps } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TaskDetail } from './TaskDetail';
import { TaskForm } from './TaskForm';
import { useTagsQuery } from '@/hooks/useTags';
import { useSectionsQuery } from '@/hooks/useSections';
import { useToggleChecklistItemMutation } from '@/hooks/useTasks';

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
    const [localTask, setLocalTask] = useState<Task | null>(task);
    const { projects } = usePage<PageProps>().props;
    const { data: tagsResponse } = useTagsQuery();
    const { data: sectionsResponse } = useSectionsQuery();
    const tags = tagsResponse?.data ?? [];
    const sections = sectionsResponse?.data ?? [];
    const toggleChecklistItem = useToggleChecklistItemMutation();

    // Keep local task in sync when the prop changes (e.g. dialog reopened with a different task)
    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    // Reset to view mode when dialog closes or task changes
    function handleOpenChange(value: boolean) {
        if (!value) {
            setIsEditing(false);
        }
        onOpenChange(value);
    }

    function handleToggleChecklistItem(_taskId: number, itemId: number) {
        // Optimistically flip the item in local state so the UI updates immediately
        setLocalTask((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                checklist_items: prev.checklist_items?.map((item) =>
                    item.id === itemId
                        ? { ...item, is_completed: !item.is_completed }
                        : item,
                ),
            };
        });

        toggleChecklistItem.mutate(itemId);
    }

    if (!localTask) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="!grid-rows-none !grid-cols-none !gap-0 !flex flex-col p-0 sm:max-w-2xl sm:max-h-[85vh]">
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

                <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
                    {isEditing ? (
                        <TaskForm
                            task={localTask ?? undefined}
                            projects={projects}
                            sections={sections}
                            tags={tags}
                            onClose={() => {
                                setIsEditing(false);
                                handleOpenChange(false);
                            }}
                            renderActions={({ submit, isSubmitting, isValid }) => (
                                <DialogFooter className="sticky bottom-0 bg-bg border-t border-border px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] mt-4 gap-2 flex-row justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={submit}
                                        disabled={!isValid || isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Update Task'}
                                    </Button>
                                </DialogFooter>
                            )}
                        />
                    ) : (
                        <>
                            <TaskDetail
                                task={localTask!}
                                onToggleChecklistItem={handleToggleChecklistItem}
                            />
                            <DialogFooter className="sticky bottom-0 bg-bg border-t border-border px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] mt-4 flex-row justify-end sm:hidden">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleOpenChange(false)}
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
