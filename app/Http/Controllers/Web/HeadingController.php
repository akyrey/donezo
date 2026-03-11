<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Heading;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class HeadingController extends Controller
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

        $project->headings()->create([
            'name' => $validated['name'],
            'position' => $maxPosition + 1,
        ]);

        return redirect()->route('projects.show', $project);
    }

    /**
     * Delete a heading, moving its tasks to Unassigned, and redirect back.
     */
    public function destroy(Request $request, Heading $heading): RedirectResponse
    {
        $project = $heading->project;

        abort_unless($project->user_id === $request->user()->id, 403);

        $heading->tasks()->update(['heading_id' => null]);
        $heading->delete();

        return redirect()->route('projects.show', $project);
    }
}
