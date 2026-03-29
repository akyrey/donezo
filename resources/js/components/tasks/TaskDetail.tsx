import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Folder, Sun, Bell, Tag as TagIcon, CheckSquare } from 'lucide-react';
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
  readOnly?: boolean;
}

export function TaskDetail({
  task,
  className,
  onToggleChecklistItem,
  readOnly = false,
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
            onCheckedChange={
              readOnly
                ? undefined
                : () =>
                    completeMutation.mutate({
                      id: task.id,
                      completed: !isCompleted,
                    })
            }
            disabled={readOnly}
            className="h-6 w-6 cursor-pointer"
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2
            className={cn(
              'text-text text-xl leading-snug font-semibold',
              isCompleted && 'text-text-tertiary line-through',
            )}
          >
            <MarkdownContent content={task.title} inline />
          </h2>
          {isCompleted && <p className="text-text-tertiary mt-1 text-xs">Completed</p>}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className="border-border bg-bg-secondary/50 rounded-xl border px-4 py-3">
          <p className="text-text-tertiary mb-1.5 text-xs font-semibold tracking-wider uppercase">
            Notes
          </p>
          <div className="prose prose-sm text-text-secondary max-w-none text-sm">
            <MarkdownContent content={task.description} />
          </div>
        </div>
      )}

      {/* Metadata */}
      {hasMetadata && (
        <div className="border-border bg-bg-secondary/50 rounded-xl border px-4 py-3">
          <p className="text-text-tertiary mb-3 text-xs font-semibold tracking-wider uppercase">
            Details
          </p>
          <div className="space-y-2.5">
            {task.scheduled_at && (
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-primary/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Calendar className="text-primary h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-text-tertiary text-xs">Scheduled</p>
                  <p className="text-text font-medium">
                    {format(new Date(task.scheduled_at), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}

            {task.deadline_at && (
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-warning/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Clock className="text-warning h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-text-tertiary text-xs">Deadline</p>
                  <p className="text-text font-medium">
                    {format(new Date(task.deadline_at), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}

            {task.is_evening && (
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-bg-tertiary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Sun className="text-text-secondary h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-text-tertiary text-xs">Time of day</p>
                  <p className="text-text font-medium">Evening</p>
                </div>
              </div>
            )}

            {task.project_id && (
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-bg-tertiary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Folder className="text-text-secondary h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-text-tertiary text-xs">Project</p>
                  <p className="text-text font-medium">#{task.project_id}</p>
                </div>
              </div>
            )}

            {task.completed_at && (
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-success/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Clock className="text-success h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-text-tertiary text-xs">Completed</p>
                  <p className="text-text font-medium">
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
        <div className="border-border bg-bg-secondary/50 rounded-xl border px-4 py-3">
          <div className="mb-3 flex items-center gap-2">
            <TagIcon className="text-text-tertiary h-3.5 w-3.5" />
            <p className="text-text-tertiary text-xs font-semibold tracking-wider uppercase">
              Tags
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" color={tag.color ?? undefined}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      {task.checklist_items && task.checklist_items.length > 0 && (
        <div className="border-border bg-bg-secondary/50 rounded-xl border px-4 py-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="text-text-tertiary h-3.5 w-3.5" />
              <p className="text-text-tertiary text-xs font-semibold tracking-wider uppercase">
                Checklist
              </p>
            </div>
            <span className="text-text-tertiary text-xs tabular-nums">
              {task.checklist_items.filter((i) => i.is_completed).length}
              &thinsp;/&thinsp;{task.checklist_items.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="bg-bg-tertiary mb-3 h-1 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
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
                  className="hover:bg-bg-tertiary flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors"
                  onClick={() => onToggleChecklistItem?.(task.id, item.id, !item.is_completed)}
                >
                  <Checkbox
                    checked={item.is_completed}
                    onCheckedChange={() =>
                      onToggleChecklistItem?.(task.id, item.id, !item.is_completed)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span
                    className={cn(
                      'text-text text-sm',
                      item.is_completed && 'text-text-tertiary line-through',
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
        <div className="border-border bg-bg-secondary/50 rounded-xl border px-4 py-3">
          <div className="mb-3 flex items-center gap-2">
            <Bell className="text-text-tertiary h-3.5 w-3.5" />
            <p className="text-text-tertiary text-xs font-semibold tracking-wider uppercase">
              Reminders
            </p>
          </div>
          <div className="space-y-2">
            {task.reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm"
              >
                <span className="bg-primary/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  <Bell className="text-primary h-3 w-3" />
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
