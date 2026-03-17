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
      className="group border-border bg-bg hover:border-primary/30 flex flex-col rounded-xl border p-5 transition-all hover:shadow-sm"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <FolderKanban className="text-primary h-4 w-4" />
        </div>
        <h3 className="text-text group-hover:text-primary font-medium">{project.name}</h3>
      </div>

      {project.description && (
        <p className="text-text-secondary mb-2 line-clamp-2 text-sm">{project.description}</p>
      )}

      <p className="text-text-tertiary mt-auto text-xs">
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
          <h1 className="text-text flex items-center gap-3 text-2xl font-semibold">
            <LayoutGrid className="text-text-secondary h-6 w-6" />
            {section.name}
          </h1>
        </div>

        {/* Projects in this section */}
        {projects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-text-secondary mb-4 text-sm font-semibold tracking-wide uppercase">
              Projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Tasks directly in this section */}
        {tasks.length > 0 && (
          <section>
            <h2 className="text-text-secondary mb-4 text-sm font-semibold tracking-wide uppercase">
              Tasks
            </h2>
            <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
          </section>
        )}

        {/* Empty state */}
        {projects.length === 0 && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <LayoutGrid className="text-text-tertiary h-8 w-8" />
            </div>
            <h2 className="text-text text-lg font-medium">This section is empty</h2>
            <p className="text-text-secondary mt-1 text-sm">
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
