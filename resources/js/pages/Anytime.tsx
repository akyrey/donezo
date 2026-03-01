import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Layers } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import type { Task } from '@/types';

interface AnytimeProps {
    tasks: Task[];
}

export default function Anytime({ tasks }: AnytimeProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    return (
        <AuthenticatedLayout>
            <Head title="Anytime" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <Layers className="h-6 w-6 text-text-secondary" />
                        Anytime
                    </h1>
                </div>

                {tasks.length > 0 ? (
                    <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <Layers className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            No anytime tasks
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Tasks without a specific date will appear here.
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
