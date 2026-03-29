import { useState, type SubmitEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { show as showProject, store as storeProject } from '@/routes/projects';
import { CheckCircle2, ChevronDown, ChevronRight, FolderKanban, Plus } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Project } from '@/types';

interface ProjectsIndexProps {
  projects: Project[];
  completed_projects: Project[];
  openDialog?: boolean;
}

function ProjectCard({ project, completed = false }: { project: Project; completed?: boolean }) {
  const totalTasks = project.task_count ?? 0;
  const completedTasks = project.completed_task_count ?? 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // SVG pie chart
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Link
      href={showProject.url(project.id)}
      className={`group border-border bg-bg hover:border-primary/30 flex flex-col rounded-xl border p-5 transition-all hover:shadow-sm ${completed ? 'opacity-60' : ''}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="bg-primary/10 relative flex h-10 w-10 items-center justify-center rounded-xl text-lg">
          <FolderKanban className="text-primary h-5 w-5" />
          {completed && (
            <CheckCircle2 className="text-success bg-bg absolute -right-1 -bottom-1 h-4 w-4 rounded-full" />
          )}
        </div>

        {totalTasks > 0 && (
          <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
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
              className={completed ? 'text-success' : 'text-primary'}
              transform="rotate(-90 18 18)"
            />
          </svg>
        )}
      </div>

      <h3
        className={`text-text group-hover:text-primary font-medium ${completed ? 'decoration-text-tertiary line-through' : ''}`}
      >
        {project.name}
      </h3>

      {project.description && (
        <p className="text-text-secondary mt-1 line-clamp-2 text-sm">{project.description}</p>
      )}

      <p className="text-text-tertiary mt-3 text-xs">
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
    name: '',
    description: '',
  });

  const submit: SubmitEventHandler = (e) => {
    e.preventDefault();
    post(storeProject.url(), {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 bg-black/40" />
        <Dialog.Content className="border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-text text-lg font-semibold">New Project</Dialog.Title>
          <Dialog.Description className="text-text-secondary mt-1 text-sm">
            Create a new project to organize your tasks.
          </Dialog.Description>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input
              label="Project name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              error={errors.name}
              placeholder="e.g., Home Renovation"
              autoFocus
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-text text-sm font-medium">Description (optional)</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="border-border bg-bg text-text placeholder:text-text-tertiary focus-visible:ring-primary/50 flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
                placeholder="What's this project about?"
              />
              {errors.description && <p className="text-danger text-xs">{errors.description}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function ProjectsIndex({
  projects,
  completed_projects,
  openDialog = false,
}: ProjectsIndexProps) {
  const [dialogOpen, setDialogOpen] = useState(openDialog);
  const [showCompleted, setShowCompleted] = useState(false);

  const totalProjects = projects.length + completed_projects.length;
  const completedCount = completed_projects.length;
  const hasAnyProjects = totalProjects > 0;

  return (
    <AuthenticatedLayout>
      <Head title="Projects" />

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-text flex items-center gap-3 text-2xl font-semibold">
            <FolderKanban className="text-primary h-6 w-6" />
            Projects
          </h1>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Overall progress counter */}
        {hasAnyProjects && (
          <div className="mb-6 flex items-center gap-4">
            <p className="text-text-secondary text-sm">
              <span className="text-text font-medium">{completedCount}</span> of{' '}
              <span className="text-text font-medium">{totalProjects}</span> projects completed
            </p>
            {totalProjects > 0 && (
              <div className="max-w-48 flex-1">
                <div className="bg-bg-tertiary h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / totalProjects) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {hasAnyProjects ? (
          <div className="space-y-8">
            {/* Active projects */}
            {projects.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {/* Completed projects toggle + section */}
            {completed_projects.length > 0 && (
              <div>
                <button
                  onClick={() => setShowCompleted((v) => !v)}
                  className="text-text-secondary hover:text-text mb-4 flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  {showCompleted ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <CheckCircle2 className="text-success h-4 w-4" />
                  {showCompleted ? 'Hide' : 'Show'} completed ({completed_projects.length})
                </button>

                {showCompleted && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {completed_projects.map((project) => (
                      <ProjectCard key={project.id} project={project} completed />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <FolderKanban className="text-text-tertiary h-8 w-8" />
            </div>
            <h2 className="text-text text-lg font-medium">No projects yet</h2>
            <p className="text-text-secondary mt-1 mb-4 text-sm">
              Create a project to organize related tasks.
            </p>
            <Button onClick={() => setDialogOpen(true)} size="sm">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        )}

        <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </AuthenticatedLayout>
  );
}
