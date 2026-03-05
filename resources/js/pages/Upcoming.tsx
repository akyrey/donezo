import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { format, parse, addDays, subDays, isToday, isTomorrow, startOfDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface UpcomingProps {
    grouped_tasks: Record<string, Task[]>;
    start_date?: string;
}

function CalendarStrip({
    startDate,
    onNavigate,
}: {
    startDate: Date;
    onNavigate: (date: Date) => void;
}) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
    const canGoBack = !isToday(startDate);

    return (
        <div className="mb-8 flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-text-tertiary hover:text-text"
                onClick={() => onNavigate(subDays(startDate, 7))}
                disabled={!canGoBack}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex flex-1 gap-1 overflow-x-auto pb-1">
                {days.map((day) => {
                    const isCurrentDay = isToday(day);
                    return (
                        <div
                            key={day.toISOString()}
                            className={cn(
                                'flex min-w-16 flex-col items-center rounded-xl px-3 py-2 text-center transition-colors',
                                isCurrentDay
                                    ? 'bg-primary text-white'
                                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary',
                            )}
                        >
                            <span className="text-[10px] font-medium uppercase tracking-wider">
                                {format(day, 'EEE')}
                            </span>
                            <span className="text-lg font-semibold">
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-text-tertiary hover:text-text"
                onClick={() => onNavigate(addDays(startDate, 7))}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

function formatDateHeading(dateStr: string): string {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
}

export default function Upcoming({ grouped_tasks, start_date }: UpcomingProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const currentStartDate = start_date
        ? parse(start_date, 'yyyy-MM-dd', new Date())
        : startOfDay(new Date());

    const dateKeys = Object.keys(grouped_tasks ?? {});
    const hasAnyTasks = dateKeys.some(
        (key) => grouped_tasks[key].length > 0,
    );

    function handleNavigate(date: Date) {
        // Don't navigate before today
        const today = startOfDay(new Date());
        const targetDate = date < today ? today : date;

        router.get(
            route('upcoming'),
            { start_date: format(targetDate, 'yyyy-MM-dd') },
            { preserveState: true, preserveScroll: true },
        );
    }

    return (
        <AuthenticatedLayout taskContext="upcoming">
            <Head title="Upcoming" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <Calendar className="h-6 w-6 text-success" />
                        Upcoming
                    </h1>
                    {!isToday(currentStartDate) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-text-secondary"
                            onClick={() => handleNavigate(new Date())}
                        >
                            Today
                        </Button>
                    )}
                </div>

                <CalendarStrip
                    startDate={currentStartDate}
                    onNavigate={handleNavigate}
                />

                {hasAnyTasks ? (
                    <div className="space-y-8">
                        {dateKeys.map((dateStr) => {
                            const tasks = grouped_tasks[dateStr];
                            if (tasks.length === 0) return null;

                            return (
                                <section key={dateStr}>
                                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                                        {formatDateHeading(dateStr)}
                                    </h2>
                                    <TaskList tasks={tasks} onSelectTask={setSelectedTask} />
                                </section>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
                            <Calendar className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <h2 className="text-lg font-medium text-text">
                            No upcoming tasks
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Plan ahead!
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
