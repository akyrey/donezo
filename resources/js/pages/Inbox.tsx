import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Inbox as InboxIcon } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import type { Task } from '@/types';

interface InboxProps {
    tasks: Task[];
}

export default function Inbox({ tasks }: InboxProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    return (
        <AuthenticatedLayout>
            <Head title="Inbox" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <InboxIcon className="h-6 w-6 text-primary" />
                        Inbox
                    </h1>
                </div>

                {tasks.length > 0 ? (
                    <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <InboxIcon className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            Your inbox is empty
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Capture new tasks here.
                        </p>
                    </div>
                )}

                <div className="sticky bottom-0 mt-6 border-t border-border bg-bg pb-4 pt-4">
                    <TaskForm placeholder="Add to Inbox..." context="inbox" />
                </div>
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
