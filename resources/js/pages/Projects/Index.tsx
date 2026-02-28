import { useState, type SubmitEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FolderKanban, Plus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectsIndexProps {
    projects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
    const totalTasks = project.tasks?.length ?? 0;
    const completedTasks =
        project.tasks?.filter((t) => t.is_completed).length ?? 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // SVG pie chart
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Link
            href={route('projects.show', project.id)}
            className="group flex flex-col rounded-xl border border-border bg-bg p-5 transition-all hover:border-primary/30 hover:shadow-sm"
        >
            <div className="mb-3 flex items-start justify-between">
                <div
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl text-lg',
                        project.color
                            ? `bg-[${project.color}]/10`
                            : 'bg-primary/10',
                    )}
                >
                    {project.icon || (
                        <FolderKanban
                            className={cn(
                                'h-5 w-5',
                                project.color
                                    ? `text-[${project.color}]`
                                    : 'text-primary',
                            )}
                        />
                    )}
                </div>

                {totalTasks > 0 && (
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        className="shrink-0"
                    >
                        <circle
                            cx="18"
                            cy="18"
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-border-light"
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="text-primary"
                            transform="rotate(-90 18 18)"
                        />
                    </svg>
                )}
            </div>

            <h3 className="font-medium text-text group-hover:text-primary">
                {project.title}
            </h3>

            {project.description && (
                <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                    {project.description}
                </p>
            )}

            <p className="mt-3 text-xs text-text-tertiary">
                {completedTasks}/{totalTasks} tasks
            </p>
        </Link>
    );
}

function CreateProjectDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
    });

    const submit: SubmitEventHandler = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-bg p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <Dialog.Title className="text-lg font-semibold text-text">
                        New Project
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-text-secondary">
                        Create a new project to organize your tasks.
                    </Dialog.Description>

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <Input
                            label="Project name"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            error={errors.title}
                            placeholder="e.g., Home Renovation"
                            autoFocus
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text">
                                Description (optional)
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="flex min-h-[80px] w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1"
                                placeholder="What's this project about?"
                            />
                            {errors.description && (
                                <p className="text-xs text-danger">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Dialog.Close asChild>
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Creating...'
                                    : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Projects" />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <FolderKanban className="h-6 w-6 text-primary" />
                        Projects
                    </h1>
                    <Button onClick={() => setDialogOpen(true)} size="sm">
                        <Plus className="h-4 w-4" />
                        New Project
                    </Button>
                </div>

                {projects.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <FolderKanban className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            No projects yet
                        </h2>
                        <p className="mt-1 mb-4 text-sm text-text-secondary">
                            Create a project to organize related tasks.
                        </p>
                        <Button onClick={() => setDialogOpen(true)} size="sm">
                            <Plus className="h-4 w-4" />
                            New Project
                        </Button>
                    </div>
                )}

                <CreateProjectDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                />
            </div>
        </AuthenticatedLayout>
    );
}
