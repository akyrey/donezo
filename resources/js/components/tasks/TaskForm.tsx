import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, FileText, Palette, X } from 'lucide-react';
import type { Task, Project, Section, Tag } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { Checkbox } from '@/components/ui/Checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { useTaskMutation, useUpdateTaskMutation, type TaskCreateData } from '@/hooks/useTasks';
import { useTagMutation } from '@/hooks/useTags';

const TAG_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#6b7280',
  '#000000',
];

interface TaskFormProps {
  task?: Task;
  projects?: Project[];
  sections?: Section[];
  tags?: Tag[];
  onClose?: () => void;
  defaultProjectId?: number;
  defaultSectionId?: number;
  /** Placeholder text for the title input (used in inline quick-add mode) */
  placeholder?: string;
  /** Context hint indicating where the task is being created (e.g. "inbox", "today", "project") */
  context?: string;
  /** Shorthand for defaultProjectId, used in inline quick-add mode */
  projectId?: number;
  /** Force inline (compact) UI regardless of context */
  inline?: boolean;
  /**
   * When provided, the built-in Cancel/Submit button row is suppressed and
   * this render-prop is called instead. The parent (e.g. a dialog sticky
   * footer) is responsible for rendering the buttons and calling submit().
   * Receives: { submit, isSubmitting, isEditing, isValid }
   */
  renderActions?: (args: {
    submit: () => void;
    isSubmitting: boolean;
    isEditing: boolean;
    isValid: boolean;
  }) => React.ReactNode;
}

interface ChecklistEntry {
  id?: number;
  title: string;
  is_completed: boolean;
  position: number;
}

interface ReminderEntry {
  id?: number;
  remind_at: string;
}

export function TaskForm({
  task,
  projects = [],
  sections = [],
  tags = [],
  onClose,
  defaultProjectId,
  defaultSectionId,
  placeholder = 'Task title',
  context,
  projectId: projectIdProp,
  inline,
  renderActions,
}: TaskFormProps) {
  const isEditing = !!task;
  const isInline = inline ?? false;

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [scheduledAt, setScheduledAt] = useState(
    task?.scheduled_at ? task.scheduled_at.substring(0, 10) : '',
  );
  const [deadlineAt, setDeadlineAt] = useState(
    task?.deadline_at ? task.deadline_at.substring(0, 10) : '',
  );
  const [isEvening, setIsEvening] = useState(task?.is_evening ?? false);
  const [projectId, setProjectId] = useState<number | undefined>(
    task?.project_id ?? projectIdProp ?? defaultProjectId,
  );
  const [headingId, setHeadingId] = useState<number | undefined>(task?.heading_id ?? undefined);
  const [sectionId, setSectionId] = useState<number | undefined>(
    task?.section_id ?? defaultSectionId,
  );
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    task?.tags?.map((t) => t.id) ?? [],
  );
  const [checklistItems, setChecklistItems] = useState<ChecklistEntry[]>(
    task?.checklist_items?.map((item) => ({
      id: item.id,
      title: item.title,
      is_completed: item.is_completed,
      position: item.position,
    })) ?? [],
  );
  const [reminders, setReminders] = useState<ReminderEntry[]>(
    task?.reminders?.map((r) => ({
      id: r.id,
      remind_at: r.remind_at,
    })) ?? [],
  );
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newReminderAt, setNewReminderAt] = useState('');
  const [showInlineDescription, setShowInlineDescription] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<string | undefined>(undefined);

  const createMutation = useTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const tagMutation = useTagMutation();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Determine default status based on context
  function getDefaultStatus(): TaskCreateData['status'] {
    switch (context) {
      case 'today':
        return 'today';
      case 'upcoming':
        return 'upcoming';
      case 'anytime':
        return 'anytime';
      case 'someday':
        return 'someday';
      default:
        return 'inbox';
    }
  }

  function submitForm() {
    if (!title.trim()) return;

    const data: TaskCreateData = {
      title: title.trim(),
      description: description.trim() || undefined,
      status: getDefaultStatus(),
      scheduled_at: scheduledAt || undefined,
      deadline_at: deadlineAt || undefined,
      is_evening: isEvening,
      project_id: projectId,
      heading_id: headingId,
      section_id: sectionId,
      tags: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      checklist_items: checklistItems.map((item, idx) => ({
        title: item.title,
        position: idx,
      })),
      reminders: reminders.map((r) => ({
        remind_at: r.remind_at,
      })),
    };

    if (isEditing && task) {
      updateMutation.mutate({ id: task.id, ...data }, { onSuccess: () => onClose?.() });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setScheduledAt('');
          setDeadlineAt('');
          setIsEvening(false);
          setHeadingId(undefined);
          setChecklistItems([]);
          setReminders([]);
          setSelectedTagIds([]);
          setShowInlineDescription(false);
          onClose?.();
        },
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitForm();
  }

  function addChecklistItem() {
    if (!newChecklistTitle.trim()) return;
    setChecklistItems((prev) => [
      ...prev,
      {
        title: newChecklistTitle.trim(),
        is_completed: false,
        position: prev.length,
      },
    ]);
    setNewChecklistTitle('');
  }

  function removeChecklistItem(index: number) {
    setChecklistItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addReminder() {
    if (!newReminderAt) return;
    setReminders((prev) => [...prev, { remind_at: newReminderAt }]);
    setNewReminderAt('');
  }

  function removeReminder(index: number) {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  }

  function createTag() {
    const name = newTagName.trim();
    if (!name) return;
    tagMutation.mutate(
      { name, color: newTagColor },
      {
        onSuccess: (tag) => {
          setSelectedTagIds((prev) => [...prev, tag.id]);
          setNewTagName('');
          setNewTagColor(undefined);
        },
      },
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 pb-4">
        {/* Title */}
        <Input
          placeholder={placeholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className={cn(
            isInline
              ? 'border-border/60 focus-visible:border-primary rounded-none border-0 border-b bg-transparent px-1 text-base font-medium shadow-none transition-colors focus-visible:ring-0'
              : 'border-none px-0 text-base font-medium shadow-none focus-visible:ring-0',
          )}
        />

        {/* Inline description toggle + textarea */}
        {isInline && (
          <>
            {showInlineDescription ? (
              <textarea
                placeholder="Add notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                autoFocus
                className={cn(
                  'border-border/60 bg-bg-secondary/50 text-text w-full resize-none rounded-md border px-3 py-2 text-sm',
                  'placeholder:text-text-tertiary',
                  'focus:ring-primary/40 focus:border-primary/40 focus:ring-1 focus:outline-none',
                  'transition-all',
                )}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowInlineDescription(true)}
                className={cn(
                  'text-text-tertiary flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs',
                  'hover:text-text-secondary hover:bg-bg-secondary/70 transition-all',
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                Add notes
              </button>
            )}
          </>
        )}

        {/* Description - only in full form mode */}
        {!isInline && (
          <>
            <textarea
              placeholder="Add notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={cn(
                'border-border bg-bg text-text-secondary w-full resize-none rounded-lg border px-3 py-2 text-sm',
                'placeholder:text-text-tertiary',
                'focus:ring-primary/50 focus:ring-2 focus:outline-none',
              )}
            />

            <Separator />

            {/* Scheduling */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-text text-sm font-medium">Scheduled date</label>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="border-border bg-bg text-text focus-visible:ring-primary/50 flex h-9 w-full min-w-0 cursor-pointer rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                  />
                  {scheduledAt && (
                    <button
                      type="button"
                      onClick={() => setScheduledAt('')}
                      className="text-text-tertiary hover:text-danger shrink-0"
                      aria-label="Clear scheduled date"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text text-sm font-medium">Deadline</label>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={deadlineAt}
                    onChange={(e) => setDeadlineAt(e.target.value)}
                    className="border-border bg-bg text-text focus-visible:ring-primary/50 flex h-9 w-full min-w-0 cursor-pointer rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                  />
                  {deadlineAt && (
                    <button
                      type="button"
                      onClick={() => setDeadlineAt('')}
                      className="text-text-tertiary hover:text-danger shrink-0"
                      aria-label="Clear deadline"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <label className="text-text-secondary flex items-center gap-2 text-sm">
              <Checkbox
                checked={isEvening}
                onCheckedChange={(checked) => setIsEvening(checked === true)}
              />
              Evening task
            </label>

            <Separator />

            {/* Project, Heading, and Section */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-text text-sm font-medium">Project</label>
                <select
                  value={projectId ?? ''}
                  onChange={(e) => {
                    const newProjectId = e.target.value ? Number(e.target.value) : undefined;
                    setProjectId(newProjectId);
                    setHeadingId(undefined);
                  }}
                  className="border-border bg-bg text-text focus:ring-primary/50 h-9 w-full cursor-pointer rounded-lg border px-3 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none"
                >
                  <option value="">No project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-text text-sm font-medium">Section</label>
                <select
                  value={sectionId ?? ''}
                  onChange={(e) =>
                    setSectionId(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="border-border bg-bg text-text focus:ring-primary/50 h-9 w-full cursor-pointer rounded-lg border px-3 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none"
                >
                  <option value="">No section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Heading — only shown when a project with headings is selected */}
            {(() => {
              const selectedProject = projectId
                ? projects.find((p) => p.id === projectId)
                : undefined;
              const availableHeadings = selectedProject?.headings?.filter((h) => !h.archived_at);

              if (!availableHeadings || availableHeadings.length === 0) return null;

              return (
                <div className="flex flex-col gap-1.5">
                  <label className="text-text text-sm font-medium">Heading</label>
                  <select
                    value={headingId ?? ''}
                    onChange={(e) =>
                      setHeadingId(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="border-border bg-bg text-text focus:ring-primary/50 h-9 w-full cursor-pointer rounded-lg border px-3 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none"
                  >
                    <option value="">No heading</option>
                    {availableHeadings.map((heading) => (
                      <option key={heading.id} value={heading.id}>
                        {heading.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })()}

            <Separator />

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-text text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                      selectedTagIds.includes(tag.id)
                        ? 'bg-primary text-white'
                        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-secondary',
                    )}
                  >
                    {tag.color && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                    )}
                    {tag.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="New tag..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      createTag();
                    }
                  }}
                  disabled={tagMutation.isPending}
                  wrapperClassName="min-w-0 flex-1"
                />
                {/* Color swatch picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
                        newTagColor
                          ? 'border-transparent'
                          : 'border-border bg-bg hover:border-primary/50 hover:bg-bg-secondary',
                      )}
                      style={newTagColor ? { backgroundColor: newTagColor } : undefined}
                      title="Pick a color"
                    >
                      {!newTagColor && <Palette className="text-text-tertiary h-4 w-4" />}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="end">
                    <p className="text-text-secondary mb-2 text-xs font-medium">Tag color</p>
                    <div className="grid grid-cols-5 gap-2">
                      {/* "No color" option */}
                      <button
                        type="button"
                        onClick={() => setNewTagColor(undefined)}
                        className={cn(
                          'bg-bg-tertiary h-6 w-6 rounded-full border-2 transition-colors',
                          !newTagColor
                            ? 'border-primary'
                            : 'hover:border-border border-transparent',
                        )}
                        title="No color"
                      />
                      {TAG_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTagColor(color)}
                          className={cn(
                            'h-6 w-6 rounded-full border-2 transition-colors',
                            newTagColor === color
                              ? 'border-primary scale-110'
                              : 'hover:border-border border-transparent',
                          )}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={createTag}
                  disabled={!newTagName.trim() || tagMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Checklist */}
            <div className="space-y-2">
              <label className="text-text text-sm font-medium">Checklist</label>
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary flex items-center gap-2 rounded-md px-2 py-1.5"
                >
                  <GripVertical className="text-text-tertiary h-3.5 w-3.5" />
                  <span className="text-text flex-1 text-sm">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
                    className="text-text-tertiary hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add checklist item..."
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChecklistItem();
                    }
                  }}
                  wrapperClassName="min-w-0 flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={addChecklistItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Reminders */}
            <div className="space-y-2">
              <label className="text-text text-sm font-medium">Reminders</label>
              {reminders.map((reminder, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary flex items-center gap-2 rounded-md px-2 py-1.5"
                >
                  <span className="text-text flex-1 text-sm">
                    {new Date(reminder.remind_at).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeReminder(index)}
                    className="text-text-tertiary hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="datetime-local"
                  value={newReminderAt}
                  onChange={(e) => setNewReminderAt(e.target.value)}
                  wrapperClassName="min-w-0 flex-1"
                />
                {newReminderAt && (
                  <button
                    type="button"
                    onClick={() => setNewReminderAt('')}
                    className="text-text-tertiary hover:text-danger shrink-0"
                    aria-label="Clear reminder date"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button type="button" variant="ghost" size="icon" onClick={addReminder}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Actions — only rendered when no external renderActions is provided */}
        {!renderActions && (
          <div className="flex justify-end gap-2">
            {onClose && (
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        )}
      </form>
      {renderActions?.({
        submit: submitForm,
        isSubmitting,
        isEditing,
        isValid: !!title.trim(),
      })}
    </>
  );
}
