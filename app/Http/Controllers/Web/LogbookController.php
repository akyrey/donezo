<?php

namespace App\Http\Controllers\Web;

use App\Data\TaskData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogbookController extends Controller
{
    /**
     * Display the Logbook view with completed and cancelled tasks (paginated).
     */
    public function index(Request $request): Response
    {
        $tasks = $request->user()
            ->tasks()
            ->where(function ($query) {
                $query->whereNotNull('completed_at')
                    ->orWhereNotNull('cancelled_at');
            })
            ->orderByDesc('completed_at')
            ->orderByDesc('cancelled_at')
            ->with(['tags', 'project'])
            ->paginate(50);

        return Inertia::render('Logbook', [
            'tasks' => TaskData::collect($tasks->items()),
            'pagination' => [
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
            ],
        ]);
    }
}
