import React, { type SubmitEventHandler, useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FolderKanban, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import { TaskItem } from '@/components/tasks/TaskItem';
import { SortableTaskItem } from '@/components/tasks/SortableTaskItem';
import { SortableHeading } from '@/components/projects/SortableHeading';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useReorderTasksMutation, useReorderHeadingsMutation } from '@/hooks/useTasks';
import type { Project, Task, Heading } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Virtual container ID for tasks not assigned to any heading. */
const UNASSIGNED_CONTAINER = 'unassigned';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getContainerForTask(task: Task): string {
    return task.heading_id ? `heading:${task.heading_id}` : UNASSIGNED_CONTAINER;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ProjectShowProps {
    project: Project;
    tasks: Task[];
    headings: Heading[];
}

function AddHeadingDialog({
    projectId,
    open,
    onOpenChange,
}: {
    projectId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(route('projects.headings.store', projectId), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-bg p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
                    <Dialog.Title className="text-lg font-semibold text-text">
                        New Heading
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-text-secondary">
                        Add a heading to organize tasks in this project.
                    </Dialog.Description>

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <Input
                            label="Heading name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            placeholder="e.g., Phase 1"
                            autoFocus
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Dialog.Close asChild>
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Adding...' : 'Add Heading'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function DeleteHeadingButton({ heading }: { heading: Heading }) {
    const { delete: destroy, processing } = useForm({});

    function handleDelete() {
        destroy(route('headings.destroy', heading.id));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-bg-tertiary focus-visible:opacity-100 focus-visible:outline-none"
                    aria-label="Heading options"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4 text-text-tertiary" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    className="text-danger focus:text-danger"
                    disabled={processing}
                    onSelect={handleDelete}
                >
                    <Trash2 className="h-4 w-4" />
                    Delete heading
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectShow({
    project,
    tasks: initialTasks,
    headings: initialHeadings,
}: ProjectShowProps) {
    // ── State ──────────────────────────────────────────────────────────────────

    const [headingDialogOpen, setHeadingDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Local copies for optimistic DnD updates
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [headings, setHeadings] = useState<Heading[]>(initialHeadings);

    // Track what is being dragged
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeHeading, setActiveHeading] = useState<Heading | null>(null);

    // ── Sync server props → local state (e.g. after Inertia reload) ───────────
    // Compute a stable string key from the current server props on every render.
    // When Inertia reloads the page after a mutation, these keys change and the
    // effects below re-sync local state with the fresh server data.
    const serverTasksKey = initialTasks.map((t) => `${t.id}:${t.position}:${t.heading_id ?? ''}:${t.updated_at}`).join(',');
    const serverHeadingsKey = initialHeadings.map((h) => `${h.id}:${h.position}`).join(',');

    React.useEffect(() => {
        setTasks(initialTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverTasksKey]);

    React.useEffect(() => {
        setHeadings(initialHeadings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverHeadingsKey]);

    // ── Mutations ──────────────────────────────────────────────────────────────
    const reorderTasksMutation = useReorderTasksMutation();
    const reorderHeadingsMutation = useReorderHeadingsMutation();

    // ── Derived state ─────────────────────────────────────────────────────────
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const unassignedTasks = tasks.filter((t) => !t.heading_id);
    const tasksByHeading = useCallback(
        (headingId: number) => tasks.filter((t) => t.heading_id === headingId),
        [tasks],
    );

    // ── DnD sensors ───────────────────────────────────────────────────────────
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    );

    // ── Drag handlers ─────────────────────────────────────────────────────────

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const id = String(active.id);

        if (id.startsWith('task:')) {
            const task = tasks.find((t) => `task:${t.id}` === id) ?? null;
            setActiveTask(task);
            setActiveHeading(null);
        } else if (id.startsWith('heading:')) {
            const heading = headings.find((h) => `heading:${h.id}` === id) ?? null;
            setActiveHeading(heading);
            setActiveTask(null);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        if (!activeId.startsWith('task:')) return; // only handle task cross-container moves here

        const activeTaskObj = tasks.find((t) => `task:${t.id}` === activeId);
        if (!activeTaskObj) return;

        // Determine target container
        let targetContainer: string;
        if (overId === UNASSIGNED_CONTAINER || overId.startsWith('heading:')) {
            targetContainer = overId;
        } else if (overId.startsWith('task:')) {
            const overTask = tasks.find((t) => `task:${t.id}` === overId);
            if (!overTask) return;
            targetContainer = getContainerForTask(overTask);
        } else {
            return;
        }

        const sourceContainer = getContainerForTask(activeTaskObj);

        if (sourceContainer === targetContainer) return; // same container — sortable handles it

        // Move the task to the new container optimistically
        const newHeadingId =
            targetContainer === UNASSIGNED_CONTAINER
                ? null
                : Number(targetContainer.replace('heading:', ''));

        setTasks((prev) =>
            prev.map((t) =>
                t.id === activeTaskObj.id ? { ...t, heading_id: newHeadingId } : t,
            ),
        );
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        setActiveTask(null);
        setActiveHeading(null);

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        // ── Heading reorder ──────────────────────────────────────────────────
        if (activeId.startsWith('heading:') && overId.startsWith('heading:')) {
            const oldIndex = headings.findIndex((h) => `heading:${h.id}` === activeId);
            const newIndex = headings.findIndex((h) => `heading:${h.id}` === overId);

            if (oldIndex === newIndex) return;

            const newHeadings = arrayMove(headings, oldIndex, newIndex);
            setHeadings(newHeadings);

            reorderHeadingsMutation.mutate(
                newHeadings.map((h, i) => ({ id: h.id, position: i })),
            );
            return;
        }

        // ── Task reorder / cross-container move ──────────────────────────────
        if (!activeId.startsWith('task:')) return;

        const activeTaskObj = tasks.find((t) => `task:${t.id}` === activeId);
        if (!activeTaskObj) return;

        // Determine the target container (heading or unassigned)
        let targetContainer: string;
        if (overId === UNASSIGNED_CONTAINER || overId.startsWith('heading:')) {
            targetContainer = overId;
        } else if (overId.startsWith('task:')) {
            const overTask = tasks.find((t) => `task:${t.id}` === overId);
            if (!overTask) return;
            targetContainer = getContainerForTask(overTask);
        } else {
            return;
        }

        const newHeadingId =
            targetContainer === UNASSIGNED_CONTAINER
                ? null
                : Number(targetContainer.replace('heading:', ''));

        // Get all tasks in the target container (with the active task already moved there by onDragOver)
        const containerTasks =
            newHeadingId === null
                ? tasks.filter((t) => !t.heading_id)
                : tasks.filter((t) => t.heading_id === newHeadingId);

        const oldIndex = containerTasks.findIndex((t) => `task:${t.id}` === activeId);

        let overIndex: number;
        if (overId.startsWith('task:')) {
            overIndex = containerTasks.findIndex((t) => `task:${t.id}` === overId);
        } else {
            // Dropped on the container itself — place at end
            overIndex = containerTasks.length - 1;
        }

        if (oldIndex === -1) {
            // Task not yet in container (edge case) — just persist heading_id change
            const reorderPayload = tasks.map((t, i) => ({
                id: t.id,
                position: i,
                heading_id: t.heading_id,
            }));
            reorderTasksMutation.mutate(reorderPayload);
            return;
        }

        let newContainerTasks = containerTasks;
        if (oldIndex !== overIndex && overIndex !== -1) {
            newContainerTasks = arrayMove(containerTasks, oldIndex, overIndex);
        }

        // Rebuild full tasks list, replacing containerTasks with newly ordered ones
        const otherTasks = tasks.filter((t) => {
            if (newHeadingId === null) return !!t.heading_id;
            return t.heading_id !== newHeadingId;
        });

        const finalTasks = [...otherTasks, ...newContainerTasks];
        setTasks(finalTasks);

        // Persist: send only the affected tasks (the container that changed)
        // We send all tasks in the affected container with new positions,
        // plus the active task if it moved containers (heading_id change).
        const reorderPayload = finalTasks.map((t, i) => ({
            id: t.id,
            position: i,
            heading_id: t.heading_id,
        }));
        reorderTasksMutation.mutate(reorderPayload);
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <AuthenticatedLayout taskContext="project" defaultProjectId={project.id}>
            <Head title={project.name} />

            <div className="mx-auto max-w-2xl px-4 py-8">
                {/* Project header */}
                <div className="mb-8">
                    <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <FolderKanban className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold text-text">
                                {project.name}
                            </h1>
                        </div>
                    </div>

                    {project.description && (
                        <div className="prose prose-sm mb-6 max-w-none text-text-secondary">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {project.description}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Progress bar */}
                    {totalTasks > 0 && (
                        <div className="mb-6">
                            <div className="mb-1.5 flex items-center justify-between text-xs text-text-secondary">
                                <span>
                                    {completedTasks} of {totalTasks} completed
                                </span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Task sections with DnD */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="space-y-8">
                        {/* Unassigned tasks */}
                        {(unassignedTasks.length > 0 || headings.length === 0) && (
                            <section>
                                {headings.length > 0 && (
                                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                                        Unassigned
                                    </h2>
                                )}
                                <SortableContext
                                    id={UNASSIGNED_CONTAINER}
                                    items={unassignedTasks.map((t) => `task:${t.id}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-0.5">
                                        {unassignedTasks.map((task) => (
                                            <SortableTaskItem
                                                key={task.id}
                                                task={task}
                                                onSelect={setSelectedTask}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </section>
                        )}

                        {/* Tasks grouped by heading */}
                        <SortableContext
                            items={headings.map((h) => `heading:${h.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            {headings.map((heading) => {
                                const headingTasks = tasksByHeading(heading.id);

                                return (
                                    <Collapsible.Root key={heading.id} defaultOpen>
                                        <section>
                                            <SortableHeading
                                                heading={heading}
                                                taskCount={headingTasks.length}
                                            >
                                                <div className="group mb-3 flex w-full items-center gap-2">
                                                    <Collapsible.Trigger asChild>
                                                        <button className="flex min-w-0 flex-1 items-center gap-2 text-left">
                                                            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                                                                {heading.name}
                                                            </h2>
                                                            {headingTasks.length > 0 && (
                                                                <span className="rounded-full bg-bg-secondary px-2 py-0.5 text-xs text-text-tertiary">
                                                                    {headingTasks.length}
                                                                </span>
                                                            )}
                                                        </button>
                                                    </Collapsible.Trigger>
                                                    <DeleteHeadingButton heading={heading} />
                                                </div>
                                            </SortableHeading>

                                            <Collapsible.Content>
                                                <SortableContext
                                                    id={`heading:${heading.id}`}
                                                    items={headingTasks.map((t) => `task:${t.id}`)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    {headingTasks.length > 0 ? (
                                                        <div className="space-y-0.5">
                                                            {headingTasks.map((task) => (
                                                                <SortableTaskItem
                                                                    key={task.id}
                                                                    task={task}
                                                                    onSelect={setSelectedTask}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="py-4 text-center text-sm text-text-tertiary">
                                                            No tasks in this section
                                                        </p>
                                                    )}
                                                </SortableContext>
                                            </Collapsible.Content>
                                        </section>
                                    </Collapsible.Root>
                                );
                            })}
                        </SortableContext>
                    </div>

                    {/* Drag overlay — ghost of the dragged item */}
                    <DragOverlay dropAnimation={null}>
                        {activeTask && (
                            <div className="rounded-lg border border-border bg-bg shadow-lg opacity-95">
                                <TaskItem task={activeTask} />
                            </div>
                        )}
                        {activeHeading && (
                            <div className="rounded-lg border border-border bg-bg px-3 py-2 shadow-lg opacity-95">
                                <span className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                                    {activeHeading.name}
                                </span>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>

                {/* Empty state */}
                {totalTasks === 0 && headings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <FolderKanban className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            This project is empty
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Add tasks to get started.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHeadingDialogOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add Heading
                    </Button>
                </div>

                <AddHeadingDialog
                    projectId={project.id}
                    open={headingDialogOpen}
                    onOpenChange={setHeadingDialogOpen}
                />
            </div>

            <TaskDetailDialog
                task={selectedTask}
                open={!!selectedTask}
                onOpenChange={(open) => {
                    if (!open) setSelectedTask(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
