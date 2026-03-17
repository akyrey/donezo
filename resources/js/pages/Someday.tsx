import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Archive, Download } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import { Button } from '@/components/ui/Button';
import { useAllTasksExport } from '@/hooks/useExport';
import type { Task } from '@/types';

interface SomedayProps {
  tasks: Task[];
}

export default function Someday({ tasks }: SomedayProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { isPending: isExporting, mutate: requestExport } = useAllTasksExport({
    status: 'someday',
  });

  return (
    <AuthenticatedLayout taskContext="someday">
      <Head title="Someday" />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-text flex items-center gap-3 text-2xl font-semibold">
            <Archive className="text-text-tertiary h-6 w-6" />
            Someday
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => requestExport()}
            disabled={isExporting}
            title="Export tasks as CSV"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Requesting…' : 'Export'}
          </Button>
        </div>

        {tasks.length > 0 ? (
          <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Archive className="text-text-tertiary h-8 w-8" />
            </div>
            <h2 className="text-text text-lg font-medium">No tasks parked for someday</h2>
            <p className="text-text-secondary mt-1 text-sm">
              Move tasks here when you want to revisit them later.
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
