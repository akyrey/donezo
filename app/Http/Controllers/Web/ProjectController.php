<?php

namespace App\Http\Controllers\Web;

use App\Data\HeadingData;
use App\Data\ProjectData;
use App\Data\TaskData;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the user's projects.
     */
    public function index(Request $request): Response
    {
        $projects = $request->user()
            ->projects()
            ->withCount(['tasks', 'tasks as completed_task_count' => function ($query) {
                $query->whereNotNull('completed_at');
            }])
            ->with('headings')
            ->orderBy('position')
            ->get();

        return Inertia::render('Projects/Index', [
            'projects' => ProjectData::collect($projects),
        ]);
    }

    /**
     * Display a specific project with its tasks grouped by heading.
     */
    public function show(Request $request, Project $project): Response
    {
        abort_unless($project->user_id === $request->user()->id, 403);

        $project->load([
            'headings' => fn ($q) => $q->orderBy('position')->withCount('tasks'),
        ]);

        $tasks = $project->tasks()
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('position')
            ->with(['tags', 'checklistItems', 'reminders'])
            ->get();

        return Inertia::render('Projects/Show', [
            'project' => ProjectData::from($project),
            'tasks' => TaskData::collect($tasks),
            'headings' => HeadingData::collect($project->headings),
        ]);
    }
}
