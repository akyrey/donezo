import { Head } from '@inertiajs/react';
import { format, parse, addDays, isToday, isTomorrow } from 'date-fns';
import { Calendar } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface UpcomingProps {
    grouped_tasks: Record<string, Task[]>;
}

function CalendarStrip() {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

    return (
        <div className="mb-8 flex gap-1 overflow-x-auto pb-2">
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
    );
}

function formatDateHeading(dateStr: string): string {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
}

export default function Upcoming({ grouped_tasks }: UpcomingProps) {
    const dateKeys = Object.keys(grouped_tasks ?? {});
    const hasAnyTasks = dateKeys.some(
        (key) => grouped_tasks[key].length > 0,
    );

    return (
        <AuthenticatedLayout>
            <Head title="Upcoming" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-text">
                        <Calendar className="h-6 w-6 text-success" />
                        Upcoming
                    </h1>
                </div>

                <CalendarStrip />

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
                                    <TaskList tasks={tasks} />
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
        </AuthenticatedLayout>
    );
}
