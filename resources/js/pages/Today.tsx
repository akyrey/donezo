import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Star, AlertCircle, Sun, Moon } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import type { Task } from '@/types';

interface TodayProps {
    morning_tasks: Task[];
    evening_tasks: Task[];
    overdue_tasks: Task[];
}

export default function Today({
    morning_tasks,
    evening_tasks,
    overdue_tasks,
}: TodayProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const today = new Date();
    const dateLabel = format(today, 'EEE, MMM d');
    const hasAnyTasks =
        morning_tasks?.length > 0 ||
        evening_tasks?.length > 0 ||
        overdue_tasks?.length > 0;

    return (
        <AuthenticatedLayout taskContext="today">
            <Head title="Today" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <Star className="h-6 w-6 text-warning" />
                        Today
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        {dateLabel}
                    </p>
                </div>

                {hasAnyTasks ? (
                    <div className="space-y-8">
                        {overdue_tasks.length > 0 && (
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-danger" />
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-danger">
                                        Overdue
                                    </h2>
                                    <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                                        {overdue_tasks.length}
                                    </span>
                                </div>
                                <TaskList tasks={overdue_tasks} onSelectTask={setSelectedTask} />
                            </section>
                        )}

                        {morning_tasks.length > 0 && (
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <Sun className="h-4 w-4 text-warning" />
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                                        Morning
                                    </h2>
                                </div>
                                <TaskList tasks={morning_tasks} onSelectTask={setSelectedTask} />
                            </section>
                        )}

                        {evening_tasks.length > 0 && (
                            <section>
                                <div className="mb-3 flex items-center gap-2 border-t border-border pt-6">
                                    <Moon className="h-4 w-4 text-primary" />
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                                        This Evening
                                    </h2>
                                </div>
                                <TaskList tasks={evening_tasks} onSelectTask={setSelectedTask} />
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <Star className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            Nothing planned for today
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Enjoy your day!
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
