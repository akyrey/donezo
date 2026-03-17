<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Data\TaskData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class InboxController extends Controller
{
    /**
     * Display the inbox view with tasks that have status "inbox".
     */
    public function index(Request $request): Response
    {
        $tasks = $request->user()
            ->tasks()
            ->inbox()
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('position')
            ->with(['tags', 'checklistItems', 'reminders'])
            ->get();

        return Inertia::render('Inbox', [
            'tasks' => TaskData::collect($tasks),
        ]);
    }
}
