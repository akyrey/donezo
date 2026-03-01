import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, FolderKanban } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import type { Section, Project, Task } from '@/types';

interface SectionShowProps {
    section: Section;
    projects: Project[];
    tasks: Task[];
}

function ProjectCard({ project }: { project: Project }) {
    const totalTasks = project.task_count ?? 0;
    const completedTasks = project.completed_task_count ?? 0;

    return (
        <Link
            href={route('projects.show', project.id)}
            className="group flex flex-col rounded-xl border border-border bg-bg p-5 transition-all hover:border-primary/30 hover:shadow-sm"
        >
            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-text group-hover:text-primary">
                    {project.name}
                </h3>
            </div>

            {project.description && (
                <p className="mb-2 line-clamp-2 text-sm text-text-secondary">
                    {project.description}
                </p>
            )}

            <p className="mt-auto text-xs text-text-tertiary">
                {completedTasks}/{totalTasks} tasks
            </p>
        </Link>
    );
}

export default function SectionShow({ section, projects, tasks }: SectionShowProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    return (
        <AuthenticatedLayout>
            <Head title={section.name} />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <LayoutGrid className="h-6 w-6 text-text-secondary" />
                        {section.name}
                    </h1>
                </div>

                {/* Projects in this section */}
                {projects.length > 0 && (
                    <section className="mb-10">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                            Projects
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Tasks directly in this section */}
                {tasks.length > 0 && (
                    <section>
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                            Tasks
                        </h2>
                        <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
                    </section>
                )}

                {/* Empty state */}
                {projects.length === 0 && tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <LayoutGrid className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            This section is empty
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Add projects or tasks to this section.
                        </p>
                    </div>
                )}
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
