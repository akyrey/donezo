<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Events\HeadingCreated;
use App\Events\HeadingDeleted;
use App\Http\Controllers\Controller;
use App\Models\Heading;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class HeadingController extends Controller
{
    /**
     * Create a heading for a project and redirect back to the project page.
     */
    public function store(Request $request, Project $project): RedirectResponse
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

        broadcast(new HeadingCreated($heading, $request->user()->id))->toOthers();

        return redirect()->route('projects.show', $project);
    }

    /**
     * Delete a heading, moving its tasks to Unassigned, and redirect back.
     */
    public function destroy(Request $request, Heading $heading): RedirectResponse
    {
        $project = $heading->project;

        abort_unless($project->user_id === $request->user()->id, 403);

        $headingId = $heading->id;
        $projectId = $heading->project_id;
        $userId = $request->user()->id;

        $heading->tasks()->update(['heading_id' => null]);
        $heading->delete();

        broadcast(new HeadingDeleted($headingId, $projectId, $userId))->toOthers();

        return redirect()->route('projects.show', $project);
    }
}
