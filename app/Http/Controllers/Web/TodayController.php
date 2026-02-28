<?php

namespace App\Http\Controllers\Web;

use App\Data\TaskData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class TodayController extends Controller
{
    /**
     * Display the Today view with tasks for today, split by morning/evening.
     */
    public function index(Request $request): Response
    {
        $today = Carbon::today($request->user()->timezone);

        $tasks = $request->user()
            ->tasks()
            ->where(function ($query) use ($today) {
                $query->where('status', 'today')
                    ->orWhereDate('scheduled_at', $today);
            })
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('position')
            ->with(['tags', 'checklistItems', 'reminders', 'project'])
            ->get();

        return Inertia::render('Today', [
            'morning_tasks' => TaskData::collect($tasks->where('is_evening', false)->values()),
            'evening_tasks' => TaskData::collect($tasks->where('is_evening', true)->values()),
            'overdue_tasks' => TaskData::collect(
                $request->user()
                    ->tasks()
                    ->overdue()
                    ->orderBy('deadline_at')
                    ->with(['tags', 'checklistItems', 'reminders', 'project'])
                    ->get()
            ),
        ]);
    }
}
