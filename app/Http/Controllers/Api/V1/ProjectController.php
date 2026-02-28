<?php

namespace App\Http\Controllers\Api\V1;

use App\Data\CreateProjectData;
use App\Data\ProjectData;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ProjectController extends Controller
{
    /**
     * List all projects for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $projects = $request->user()
            ->projects()
            ->withCount(['tasks', 'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at')])
            ->with(['headings' => fn ($q) => $q->orderBy('position')->withCount('tasks')])
            ->orderBy('position')
            ->get();

        return response()->json([
            'data' => ProjectData::collect($projects),
        ]);
    }

    /**
     * Create a new project.
     */
    public function store(CreateProjectData $data, Request $request): JsonResponse
    {
        $maxPosition = $request->user()->projects()->max('position') ?? 0;

        $project = $request->user()->projects()->create([
            'name' => $data->name,
            'description' => $data->description,
            'section_id' => $data->section_id,
            'status' => 'active',
            'position' => $maxPosition + 1,
        ]);

        $project->loadCount(['tasks', 'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at')]);
        $project->load(['headings' => fn ($q) => $q->orderBy('position')->withCount('tasks')]);

        return response()->json([
            'data' => ProjectData::from($project),
        ], 201);
    }

    /**
     * Get a single project.
     */
    public function show(Request $request, Project $project): JsonResponse
    {
        abort_unless($project->user_id === $request->user()->id, 403);

        $project->loadCount(['tasks', 'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at')]);
        $project->load(['headings' => fn ($q) => $q->orderBy('position')->withCount('tasks')]);

        return response()->json([
            'data' => ProjectData::from($project),
        ]);
    }

    /**
     * Update a project.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        abort_unless($project->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'section_id' => ['sometimes', 'nullable', 'integer', 'exists:sections,id'],
            'status' => ['sometimes', 'string', 'in:active,completed,archived'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        if (isset($validated['status']) && $validated['status'] === 'completed' && ! $project->completed_at) {
            $validated['completed_at'] = Carbon::now();
        } elseif (isset($validated['status']) && $validated['status'] !== 'completed') {
            $validated['completed_at'] = null;
        }

        $project->update($validated);

        $project->loadCount(['tasks', 'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at')]);
        $project->load(['headings' => fn ($q) => $q->orderBy('position')->withCount('tasks')]);

        return response()->json([
            'data' => ProjectData::from($project),
        ]);
    }

    /**
     * Soft delete a project.
     */
    public function destroy(Request $request, Project $project): JsonResponse
    {
        abort_unless($project->user_id === $request->user()->id, 403);

        $project->delete();

        return response()->json(null, 204);
    }
}
