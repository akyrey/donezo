import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { BookOpen, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/Dialog';
import { cn } from '@/lib/utils';
import { useCompleteTaskMutation } from '@/hooks/useTasks';
import { useAllTasksExport } from '@/hooks/useExport';
import type { Paginated, Task } from '@/types';

interface LogbookProps {
    tasks: Paginated<Task>;
}

export default function Logbook({ tasks }: LogbookProps) {
    const prevLink = tasks.links.prev;
    const nextLink = tasks.links.next;
    const [taskToUncomplete, setTaskToUncomplete] = useState<Task | null>(null);
    const completeTask = useCompleteTaskMutation();
    const { isLoading: isExporting, requestExport } = useAllTasksExport({ include_completed: true });

    function handleConfirmUncomplete() {
        if (!taskToUncomplete) return;
        completeTask.mutate(
            { id: taskToUncomplete.id, completed: false },
            { onSuccess: () => setTaskToUncomplete(null) },
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Logbook" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                            <BookOpen className="h-6 w-6 text-success" />
                            Logbook
                        </h1>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={requestExport}
                            disabled={isExporting}
                            title="Export completed tasks as CSV"
                        >
                            <Download className="h-4 w-4" />
                            {isExporting ? 'Requesting…' : 'Export'}
                        </Button>
                    </div>
                    {tasks.meta.total > 0 && (
                        <p className="mt-1 text-sm text-text-secondary">
                            {tasks.meta.total} completed{' '}
                            {tasks.meta.total === 1 ? 'task' : 'tasks'}
                        </p>
                    )}
                </div>

                {tasks.data.length > 0 ? (
                    <>
                        <ul className="divide-y divide-border-light">
                            {tasks.data.map((task) => (
                                <li
                                    key={task.id}
                                    className="flex items-start gap-3 py-3"
                                >
                                    <Checkbox
                                        checked={true}
                                        className="mt-0.5 cursor-pointer"
                                        onCheckedChange={() => setTaskToUncomplete(task)}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={cn(
                                                'text-sm text-text-tertiary',
                                                task.status === 'completed' &&
                                                    'line-through',
                                            )}
                                        >
                                            {task.title}
                                        </p>
                                        {task.completed_at && (
                                            <p className="mt-0.5 text-xs text-text-tertiary">
                                                Completed{' '}
                                                {format(
                                                    new Date(task.completed_at),
                                                    'MMM d, yyyy',
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {tasks.meta.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={!prevLink}
                                    asChild={!!prevLink}
                                >
                                    {prevLink ? (
                                        <Link href={prevLink}>
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Link>
                                    ) : (
                                        <span>
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </span>
                                    )}
                                </Button>

                                <span className="text-sm text-text-secondary">
                                    Page {tasks.meta.current_page} of{' '}
                                    {tasks.meta.last_page}
                                </span>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={!nextLink}
                                    asChild={!!nextLink}
                                >
                                    {nextLink ? (
                                        <Link href={nextLink}>
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <span>
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <BookOpen className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            No completed tasks yet
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Tasks you complete will show up here.
                        </p>
                    </div>
                )}
            </div>

            <Dialog
                open={!!taskToUncomplete}
                onOpenChange={(open) => { if (!open) setTaskToUncomplete(null); }}
            >
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Mark as incomplete?</DialogTitle>
                        <DialogDescription>
                            "{taskToUncomplete?.title}" will be moved out of your Logbook and back to your tasks.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-2 gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setTaskToUncomplete(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmUncomplete}
                            disabled={completeTask.isPending}
                        >
                            {completeTask.isPending ? 'Saving...' : 'Mark incomplete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
