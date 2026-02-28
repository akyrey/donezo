<?php

namespace App\Http\Controllers\Web;

use App\Data\TaskData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SomedayController extends Controller
{
    /**
     * Display the Someday view with tasks that have status "someday".
     */
    public function index(Request $request): Response
    {
        $tasks = $request->user()
            ->tasks()
            ->someday()
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('position')
            ->with(['tags', 'checklistItems', 'reminders'])
            ->get();

        return Inertia::render('Someday', [
            'tasks' => TaskData::collect($tasks),
        ]);
    }
}
