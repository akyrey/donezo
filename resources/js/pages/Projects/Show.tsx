import { type SubmitEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FolderKanban, Plus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Project, Task, Heading } from '@/types';

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

export default function ProjectShow({
    project,
    tasks,
    headings,
}: ProjectShowProps) {
    const [headingDialogOpen, setHeadingDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Group tasks by heading
    const unassignedTasks = tasks.filter((t) => !t.heading_id);
    const tasksByHeading = headings.reduce<Record<number, Task[]>>(
        (acc, heading) => {
            acc[heading.id] = tasks.filter((t) => t.heading_id === heading.id);
            return acc;
        },
        {},
    );

    return (
        <AuthenticatedLayout>
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

                {/* Task sections */}
                <div className="space-y-8">
                    {/* Unassigned tasks */}
                    {unassignedTasks.length > 0 && (
                        <section>
                            {headings.length > 0 && (
                                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                                    Unassigned
                                </h2>
                            )}
                            <TaskList tasks={unassignedTasks} onSelectTask={setSelectedTask} />
                        </section>
                    )}

                    {/* Tasks grouped by heading */}
                    {headings.map((heading) => {
                        const headingTasks = tasksByHeading[heading.id] ?? [];

                        return (
                            <Collapsible.Root key={heading.id} defaultOpen>
                                <section>
                                    <Collapsible.Trigger asChild>
                                        <button className="mb-3 flex w-full items-center gap-2 text-left">
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

                                    <Collapsible.Content>
                                        {headingTasks.length > 0 ? (
                                            <TaskList tasks={headingTasks} onSelectTask={setSelectedTask} />
                                        ) : (
                                            <p className="py-4 text-center text-sm text-text-tertiary">
                                                No tasks in this section
                                            </p>
                                        )}
                                    </Collapsible.Content>
                                </section>
                            </Collapsible.Root>
                        );
                    })}
                </div>

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

                {/* Quick-add bar */}
                <div className="sticky bottom-0 mt-4 border-t border-border bg-bg pb-4 pt-4">
                    <TaskForm
                        placeholder="Add to project..."
                        context="project"
                        projectId={project.id}
                    />
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
