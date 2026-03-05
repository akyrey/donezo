<?php

namespace App\Http\Controllers\Web;

use App\Data\CreateProjectData;
use App\Data\HeadingData;
use App\Data\ProjectData;
use App\Data\TaskData;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
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
            ->withCount(['tasks as task_count', 'tasks as completed_task_count' => function ($query) {
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
     * Show the create project form (renders the index with the dialog open).
     */
    public function create(Request $request): Response
    {
        $projects = $request->user()
            ->projects()
            ->withCount(['tasks as task_count', 'tasks as completed_task_count' => function ($query) {
                $query->whereNotNull('completed_at');
            }])
            ->with([
                'headings' => fn ($q) => $q->orderBy('position')->withCount('tasks as task_count'),
            ])
            ->orderBy('position')
            ->get();

        return Inertia::render('Projects/Index', [
            'projects' => ProjectData::collect($projects),
            'openDialog' => true,
        ]);
    }

    /**
     * Create a new project.
     */
    public function store(CreateProjectData $data, Request $request): RedirectResponse
    {
        $maxPosition = $request->user()->projects()->max('position') ?? 0;

        $request->user()->projects()->create([
            'name' => $data->name,
            'description' => $data->description,
            'section_id' => $data->section_id,
            'status' => 'active',
            'position' => $maxPosition + 1,
        ]);

        return redirect()->route('projects.index');
    }

    /**
     * Display a specific project with its tasks grouped by heading.
     */
    public function show(Request $request, Project $project): Response
    {
        abort_unless($project->user_id === $request->user()->id, 403);

        $project->loadCount(['tasks as task_count', 'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at')]);
        $project->load([
            'headings' => fn ($q) => $q->orderBy('position')->withCount('tasks as task_count'),
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
