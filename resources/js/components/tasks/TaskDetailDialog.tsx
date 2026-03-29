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
  readOnly?: boolean;
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  readOnly = false,
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
          item.id === itemId ? { ...item, is_completed: !item.is_completed } : item,
        ),
      };
    });

    toggleChecklistItem.mutate(itemId);
  }

  if (!localTask) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!flex !grid-cols-none !grid-rows-none flex-col !gap-0 p-0 sm:max-h-[90vh] sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="border-border shrink-0 border-b px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-text truncate text-base font-semibold">
                {isEditing ? 'Edit Task' : localTask.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {isEditing
                  ? 'Edit the task details below.'
                  : 'View task details, checklist items, and metadata.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6">
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
                <DialogFooter className="bg-bg border-border sticky bottom-0 mt-4 flex-row justify-end gap-2 border-t px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={submit} disabled={!isValid || isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Update Task'}
                  </Button>
                </DialogFooter>
              )}
            />
          ) : (
            <>
              <TaskDetail
                task={localTask!}
                onToggleChecklistItem={readOnly ? undefined : handleToggleChecklistItem}
                readOnly={readOnly}
              />
              {/* Footer — shown on all screen sizes */}
              <DialogFooter className="bg-bg border-border sticky bottom-0 flex-row items-center justify-between gap-2 border-t px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <span className="text-text-tertiary text-xs">
                  {localTask.status !== 'completed'
                    ? `Status: ${localTask.status.charAt(0).toUpperCase() + localTask.status.slice(1)}`
                    : 'Completed'}
                </span>
                <div className="flex gap-2">
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenChange(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
