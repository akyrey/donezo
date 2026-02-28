import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface LogbookProps {
    tasks: {
        data: Task[];
        links: PaginationLink[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
            from: number | null;
            to: number | null;
        };
    };
}

export default function Logbook({ tasks }: LogbookProps) {
    const prevLink = tasks.links?.find((l) => l.label.includes('Previous'));
    const nextLink = tasks.links?.find((l) => l.label.includes('Next'));

    return (
        <AuthenticatedLayout>
            <Head title="Logbook" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <BookOpen className="h-6 w-6 text-success" />
                        Logbook
                    </h1>
                    {tasks.meta?.total > 0 && (
                        <p className="mt-1 text-sm text-text-secondary">
                            {tasks.meta.total} completed{' '}
                            {tasks.meta.total === 1 ? 'task' : 'tasks'}
                        </p>
                    )}
                </div>

                {tasks.data?.length > 0 ? (
                    <>
                        <ul className="divide-y divide-border-light">
                            {tasks.data.map((task) => (
                                <li
                                    key={task.id}
                                    className="flex items-start gap-3 py-3"
                                >
                                    <Checkbox
                                        checked={true}
                                        disabled
                                        className="mt-0.5 opacity-50"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={cn(
                                                'text-sm text-text-tertiary',
                                                task.is_completed &&
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
                                    disabled={!prevLink?.url}
                                    asChild={!!prevLink?.url}
                                >
                                    {prevLink?.url ? (
                                        <Link href={prevLink.url}>
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
                                    disabled={!nextLink?.url}
                                    asChild={!!nextLink?.url}
                                >
                                    {nextLink?.url ? (
                                        <Link href={nextLink.url}>
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
        </AuthenticatedLayout>
    );
}
