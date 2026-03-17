import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Download, Star, AlertCircle, Sun, Moon } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import { Button } from '@/components/ui/Button';
import { useAllTasksExport } from '@/hooks/useExport';
import type { Task } from '@/types';

interface TodayProps {
  morning_tasks: Task[];
  evening_tasks: Task[];
  overdue_tasks: Task[];
}

export default function Today({ morning_tasks, evening_tasks, overdue_tasks }: TodayProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { isPending: isExporting, mutate: requestExport } = useAllTasksExport({ status: 'today' });
  const today = new Date();
  const dateLabel = format(today, 'EEE, MMM d');
  const hasAnyTasks =
    morning_tasks?.length > 0 || evening_tasks?.length > 0 || overdue_tasks?.length > 0;

  return (
    <AuthenticatedLayout taskContext="today">
      <Head title="Today" />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-text flex items-center gap-3 text-2xl font-semibold">
              <Star className="text-warning h-6 w-6" />
              Today
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
          <p className="text-text-secondary mt-1 text-sm">{dateLabel}</p>
        </div>

        {hasAnyTasks ? (
          <div className="space-y-8">
            {overdue_tasks.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <AlertCircle className="text-danger h-4 w-4" />
                  <h2 className="text-danger text-sm font-semibold tracking-wide uppercase">
                    Overdue
                  </h2>
                  <span className="bg-danger/10 text-danger rounded-full px-2 py-0.5 text-xs font-medium">
                    {overdue_tasks.length}
                  </span>
                </div>
                <TaskList tasks={overdue_tasks} onSelectTask={setSelectedTask} />
              </section>
            )}

            {morning_tasks.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Sun className="text-warning h-4 w-4" />
                  <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
                    Morning
                  </h2>
                </div>
                <TaskList tasks={morning_tasks} onSelectTask={setSelectedTask} />
              </section>
            )}

            {evening_tasks.length > 0 && (
              <section>
                <div className="border-border mb-3 flex items-center gap-2 border-t pt-6">
                  <Moon className="text-primary h-4 w-4" />
                  <h2 className="text-text-secondary text-sm font-semibold tracking-wide uppercase">
                    This Evening
                  </h2>
                </div>
                <TaskList tasks={evening_tasks} onSelectTask={setSelectedTask} />
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Star className="text-text-tertiary h-8 w-8" />
            </div>
            <h2 className="text-text text-lg font-medium">Nothing planned for today</h2>
            <p className="text-text-secondary mt-1 text-sm">Enjoy your day!</p>
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
