<?php

namespace App\Http\Controllers\Web;

use App\Data\ProjectData;
use App\Data\SectionData;
use App\Data\TaskData;
use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SectionController extends Controller
{
    /**
     * Display a specific section with its projects and tasks.
     */
    public function show(Request $request, Section $section): Response
    {
        abort_unless($section->user_id === $request->user()->id, 403);

        $section->load([
            'projects' => fn ($q) => $q->orderBy('position')->withCount([
                'tasks as task_count',
                'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at'),
            ]),
        ]);

        $tasks = $section->tasks()
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('position')
            ->with(['tags', 'checklistItems', 'reminders'])
            ->get();

        return Inertia::render('Sections/Show', [
            'section' => SectionData::from($section),
            'projects' => ProjectData::collect($section->projects),
            'tasks' => TaskData::collect($tasks),
        ]);
    }
}
