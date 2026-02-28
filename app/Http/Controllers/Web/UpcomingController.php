<?php

namespace App\Http\Controllers\Web;

use App\Data\TaskData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class UpcomingController extends Controller
{
    /**
     * Display the Upcoming view with tasks grouped by date.
     */
    public function index(Request $request): Response
    {
        $timezone = $request->user()->timezone;
        $today = Carbon::today($timezone);

        $tasks = $request->user()
            ->tasks()
            ->where(function ($query) use ($today) {
                $query->where('status', 'upcoming')
                    ->orWhere(function ($q) use ($today) {
                        $q->whereNotNull('scheduled_at')
                            ->whereDate('scheduled_at', '>', $today);
                    });
            })
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('scheduled_at')
            ->orderBy('position')
            ->with(['tags', 'checklistItems', 'reminders', 'project'])
            ->get();

        $grouped = $tasks->groupBy(function ($task) {
            return $task->scheduled_at
                ? $task->scheduled_at->toDateString()
                : 'unscheduled';
        })->map(fn ($group) => TaskData::collect($group->values()));

        return Inertia::render('Upcoming', [
            'grouped_tasks' => $grouped,
        ]);
    }
}
