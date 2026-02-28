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
        $paginated = $request->user()
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
            'tasks' => [
                'data' => TaskData::collect($paginated->items()),
                'links' => [
                    'first' => $paginated->url(1),
                    'last' => $paginated->url($paginated->lastPage()),
                    'prev' => $paginated->previousPageUrl(),
                    'next' => $paginated->nextPageUrl(),
                ],
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'from' => $paginated->firstItem(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'to' => $paginated->lastItem(),
                    'total' => $paginated->total(),
                ],
            ],
        ]);
    }
}
