import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Archive } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import type { Task } from '@/types';

interface SomedayProps {
    tasks: Task[];
}

export default function Someday({ tasks }: SomedayProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    return (
        <AuthenticatedLayout>
            <Head title="Someday" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <Archive className="h-6 w-6 text-text-tertiary" />
                        Someday
                    </h1>
                </div>

                {tasks.length > 0 ? (
                    <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <Archive className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            No tasks parked for someday
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
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
