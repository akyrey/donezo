<?php

namespace App\Http\Controllers\Api\V1;

use App\Data\HeadingData;
use App\Http\Controllers\Controller;
use App\Models\Heading;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeadingController extends Controller
{
    /**
     * List headings for a project.
     */
    public function index(Request $request, Project $project): JsonResponse
    {
        abort_unless($project->user_id === $request->user()->id, 403);

        $headings = $project->headings()
            ->orderBy('position')
            ->withCount('tasks as task_count')
            ->get();

        return response()->json([
            'data' => HeadingData::collect($headings),
        ]);
    }

    /**
     * Create a heading for a project.
     */
    public function store(Request $request, Project $project): JsonResponse
    {
        abort_unless($project->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $maxPosition = $project->headings()->max('position') ?? -1;

        $heading = $project->headings()->create([
            'name' => $validated['name'],
            'position' => $maxPosition + 1,
        ]);

        $heading->loadCount('tasks as task_count');

        return response()->json([
            'data' => HeadingData::from($heading),
        ], 201);
    }

    /**
     * Get a single heading.
     */
    public function show(Request $request, Heading $heading): JsonResponse
    {
        abort_unless($heading->project->user_id === $request->user()->id, 403);

        $heading->loadCount('tasks as task_count');

        return response()->json([
            'data' => HeadingData::from($heading),
        ]);
    }

    /**
     * Update a heading.
     */
    public function update(Request $request, Heading $heading): JsonResponse
    {
        abort_unless($heading->project->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        $heading->update($validated);
        $heading->loadCount('tasks as task_count');

        return response()->json([
            'data' => HeadingData::from($heading),
        ]);
    }

    /**
     * Delete a heading.
     */
    public function destroy(Request $request, Heading $heading): JsonResponse
    {
        abort_unless($heading->project->user_id === $request->user()->id, 403);

        // Unassign tasks from this heading before deleting
        $heading->tasks()->update(['heading_id' => null]);
        $heading->delete();

        return response()->json(null, 204);
    }

    /**
     * Batch reorder headings within a project.
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'headings' => ['required', 'array'],
            'headings.*.id' => ['required', 'integer', 'exists:headings,id'],
            'headings.*.position' => ['required', 'integer', 'min:0'],
        ]);

        $userId = $request->user()->id;

        foreach ($validated['headings'] as $item) {
            Heading::where('id', $item['id'])
                ->whereHas('project', fn ($q) => $q->where('user_id', $userId))
                ->update(['position' => $item['position']]);
        }

        return response()->json(['message' => 'Headings reordered successfully.']);
    }
}
