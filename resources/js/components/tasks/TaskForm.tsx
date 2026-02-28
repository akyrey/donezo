import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { Task, Project, Section, Tag } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { Checkbox } from '@/components/ui/Checkbox';
import { useTaskMutation, useUpdateTaskMutation, type TaskCreateData } from '@/hooks/useTasks';

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
}: TaskFormProps) {
    const isEditing = !!task;
    const isInline = !!context;

    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [scheduledAt, setScheduledAt] = useState(task?.scheduled_at ? task.scheduled_at.substring(0, 10) : '');
    const [deadlineAt, setDeadlineAt] = useState(task?.deadline_at ? task.deadline_at.substring(0, 10) : '');
    const [isEvening, setIsEvening] = useState(task?.is_evening ?? false);
    const [projectId, setProjectId] = useState<number | undefined>(
        task?.project_id ?? projectIdProp ?? defaultProjectId,
    );
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

    const createMutation = useTaskMutation();
    const updateMutation = useUpdateTaskMutation();

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    // Determine default status based on context
    function getDefaultStatus(): TaskCreateData['status'] {
        switch (context) {
            case 'today': return 'today';
            case 'upcoming': return 'upcoming';
            case 'anytime': return 'anytime';
            case 'someday': return 'someday';
            default: return 'inbox';
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        const data: TaskCreateData = {
            title: title.trim(),
            description: description.trim() || undefined,
            status: getDefaultStatus(),
            scheduled_at: scheduledAt || undefined,
            deadline_at: deadlineAt || undefined,
            is_evening: isEvening,
            project_id: projectId,
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
            updateMutation.mutate(
                { id: task.id, ...data },
                { onSuccess: () => onClose?.() },
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    setTitle('');
                    setDescription('');
                    setScheduledAt('');
                    setDeadlineAt('');
                    setIsEvening(false);
                    setChecklistItems([]);
                    setReminders([]);
                    setSelectedTagIds([]);
                    onClose?.();
                },
            });
        }
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
        setReminders((prev) => [
            ...prev,
            { remind_at: newReminderAt },
        ]);
        setNewReminderAt('');
    }

    function removeReminder(index: number) {
        setReminders((prev) => prev.filter((_, i) => i !== index));
    }

    function toggleTag(tagId: number) {
        setSelectedTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId],
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <Input
                placeholder={placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="border-none px-0 text-base font-medium shadow-none focus-visible:ring-0"
            />

            {/* Description - only in full form mode */}
            {!isInline && (
                <>
                    <textarea
                        placeholder="Add notes..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className={cn(
                            'w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-secondary',
                            'placeholder:text-text-tertiary',
                            'focus:outline-none focus:ring-2 focus:ring-primary/50',
                        )}
                    />

                    <Separator />

                    {/* Scheduling */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            type="date"
                            label="Scheduled date"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                        />
                        <Input
                            type="date"
                            label="Deadline"
                            value={deadlineAt}
                            onChange={(e) => setDeadlineAt(e.target.value)}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-text-secondary">
                        <Checkbox
                            checked={isEvening}
                            onCheckedChange={(checked) =>
                                setIsEvening(checked === true)
                            }
                        />
                        Evening task
                    </label>

                    <Separator />

                    {/* Project and Section */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text">
                                Project
                            </label>
                            <select
                                value={projectId ?? ''}
                                onChange={(e) =>
                                    setProjectId(
                                        e.target.value ? Number(e.target.value) : undefined,
                                    )
                                }
                                className="h-9 rounded-lg border border-border bg-bg px-3 text-sm text-text"
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
                            <label className="text-sm font-medium text-text">
                                Section
                            </label>
                            <select
                                value={sectionId ?? ''}
                                onChange={(e) =>
                                    setSectionId(
                                        e.target.value ? Number(e.target.value) : undefined,
                                    )
                                }
                                className="h-9 rounded-lg border border-border bg-bg px-3 text-sm text-text"
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

                    <Separator />

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text">
                                Tags
                            </label>
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
                        </div>
                    )}

                    <Separator />

                    {/* Checklist */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text">
                            Checklist
                        </label>
                        {checklistItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 rounded-md bg-bg-secondary px-2 py-1.5"
                            >
                                <GripVertical className="h-3.5 w-3.5 text-text-tertiary" />
                                <span className="flex-1 text-sm text-text">
                                    {item.title}
                                </span>
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
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={addChecklistItem}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Reminders */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text">
                            Reminders
                        </label>
                        {reminders.map((reminder, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 rounded-md bg-bg-secondary px-2 py-1.5"
                            >
                                <span className="flex-1 text-sm text-text">
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
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={addReminder}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Separator />
                </>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
                {onClose && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={!title.trim() || isSubmitting}>
                    {isSubmitting
                        ? 'Saving...'
                        : isEditing
                          ? 'Update Task'
                          : 'Add Task'}
                </Button>
            </div>
        </form>
    );
}
