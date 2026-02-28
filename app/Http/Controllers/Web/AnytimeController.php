<?php

namespace App\Http\Controllers\Web;

use App\Data\TaskData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnytimeController extends Controller
{
    /**
     * Display the Anytime view with tasks that have status "anytime".
     */
    public function index(Request $request): Response
    {
        $tasks = $request->user()
            ->tasks()
            ->anytime()
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('position')
            ->with(['tags', 'checklistItems', 'reminders', 'project'])
            ->get();

        return Inertia::render('Anytime', [
            'tasks' => TaskData::collect($tasks),
        ]);
    }
}
