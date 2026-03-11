import React from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { TaskForm } from './TaskForm';
import { useTagsQuery } from '@/hooks/useTags';

interface AddTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Context passed to TaskForm to pre-set the task status */
    context?: string;
    /** Pre-select a project */
    defaultProjectId?: number;
}

export function AddTaskDialog({
    open,
    onOpenChange,
    context,
    defaultProjectId,
}: AddTaskDialogProps) {
    const { projects, sections } = usePage<PageProps>().props;
    const { data: tagsResponse } = useTagsQuery();
    const tags = tagsResponse?.data ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!grid-rows-none !grid-cols-none !gap-0 !flex flex-col p-0 sm:max-w-2xl sm:max-h-[85vh]">
                <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription className="sr-only">
                        Fill in the details to create a new task.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-2">
                    <TaskForm
                        projects={projects}
                        sections={sections}
                        tags={tags}
                        context={context}
                        defaultProjectId={defaultProjectId}
                        onClose={() => onOpenChange(false)}
                        renderActions={({ submit, isSubmitting, isEditing, isValid }) => (
                            <DialogFooter className="sticky bottom-0 bg-bg border-t border-border px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] mt-4 gap-2 flex-row justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={submit}
                                    disabled={!isValid || isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Add Task'}
                                </Button>
                            </DialogFooter>
                        )}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
