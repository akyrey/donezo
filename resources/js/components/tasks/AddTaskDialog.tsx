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
import { useSectionsQuery } from '@/hooks/useSections';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Context passed to TaskForm to pre-set the task status */
  context?: string;
  /** Pre-select a project */
  defaultProjectId?: number;
  /** Associate the new task with a group */
  defaultGroupId?: number;
}

export function AddTaskDialog({
  open,
  onOpenChange,
  context,
  defaultProjectId,
  defaultGroupId,
}: AddTaskDialogProps) {
  const { projects } = usePage<PageProps>().props;
  const { data: tagsResponse } = useTagsQuery();
  const tags = tagsResponse?.data ?? [];
  const { data: sectionsResponse } = useSectionsQuery();
  const sections = sectionsResponse?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!flex !grid-cols-none !grid-rows-none flex-col !gap-0 p-0 sm:max-h-[85vh] sm:max-w-2xl">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the details to create a new task.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-2">
          <TaskForm
            projects={projects}
            sections={sections}
            tags={tags}
            context={context}
            defaultProjectId={defaultProjectId}
            defaultGroupId={defaultGroupId}
            onClose={() => onOpenChange(false)}
            renderActions={({ submit, isSubmitting, isEditing, isValid }) => (
              <DialogFooter className="bg-bg border-border sticky bottom-0 mt-4 flex-row justify-end gap-2 border-t px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={submit} disabled={!isValid || isSubmitting}>
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
