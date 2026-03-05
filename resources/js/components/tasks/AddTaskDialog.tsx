import React from 'react';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/Dialog';
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
            <DialogContent className="!grid-rows-none !grid-cols-none !gap-0 !flex flex-col max-w-2xl max-h-[85vh] p-0">
                <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription className="sr-only">
                        Fill in the details to create a new task.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 pt-2">
                    <TaskForm
                        projects={projects}
                        sections={sections}
                        tags={tags}
                        context={context}
                        defaultProjectId={defaultProjectId}
                        onClose={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
