<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Data\TaskData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

final class UpcomingController extends Controller
{
    /**
     * Display the Upcoming view with tasks grouped by date.
     */
    public function index(Request $request): Response
    {
        $timezone = $request->user()->timezone;
        $today = Carbon::today($timezone);

        // Allow navigating to different weeks via start_date param
        $startDate = $request->has('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : $today;

        $endDate = $startDate->copy()->addDays(6)->endOfDay();

        $tasks = $request->user()
            ->tasks()
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('status', 'upcoming')
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->whereNotNull('scheduled_at')
                            ->whereDate('scheduled_at', '>=', $startDate)
                            ->whereDate('scheduled_at', '<=', $endDate);
                    });
            })
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('scheduled_at')
            ->orderBy('position')
            ->with(['tags', 'checklistItems', 'reminders', 'project'])
            ->get();

        // Only include tasks within the displayed date range
        $filtered = $tasks->filter(function ($task) use ($startDate, $endDate) {
            if (!$task->scheduled_at) {
                return true; // unscheduled upcoming tasks always show
            }

            /** @var Carbon $scheduledAt */
            $scheduledAt = $task->scheduled_at;

            return $scheduledAt->between($startDate, $endDate);
        });

        $grouped = $filtered->groupBy(function ($task) {
            /** @var Carbon|null $scheduledAt */
            $scheduledAt = $task->scheduled_at;

            return $scheduledAt
                ? $scheduledAt->toDateString()
                : 'unscheduled';
        })->map(fn ($group) => TaskData::collect($group->values()));

        return Inertia::render('Upcoming', [
            'grouped_tasks' => $grouped,
            'start_date' => $startDate->toDateString(),
        ]);
    }
}
