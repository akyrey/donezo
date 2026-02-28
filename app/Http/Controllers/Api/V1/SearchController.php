<?php

namespace App\Http\Controllers\Api\V1;

use App\Data\ProjectData;
use App\Data\SectionData;
use App\Data\TagData;
use App\Data\TaskData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Unified search across tasks, projects, sections, and tags.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:1', 'max:255'],
        ]);

        $query = $request->string('q');
        $user = $request->user();
        $limit = $request->integer('limit', 10);

        // Search tasks
        $tasks = $user->tasks()
            ->where(function ($q) use ($query) {
                $q->where('title', 'ilike', "%{$query}%")
                    ->orWhere('description', 'ilike', "%{$query}%");
            })
            ->whereNull('cancelled_at')
            ->orderByRaw("CASE WHEN completed_at IS NULL THEN 0 ELSE 1 END")
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->with(['tags', 'project'])
            ->get();

        // Search projects
        $projects = $user->projects()
            ->where(function ($q) use ($query) {
                $q->where('name', 'ilike', "%{$query}%")
                    ->orWhere('description', 'ilike', "%{$query}%");
            })
            ->where('status', '!=', 'archived')
            ->withCount(['tasks as task_count', 'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at')])
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get();

        // Search sections
        $sections = $user->sections()
            ->where('name', 'ilike', "%{$query}%")
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get();

        // Search tags
        $tags = $user->tags()
            ->where('name', 'ilike', "%{$query}%")
            ->orderBy('name')
            ->limit($limit)
            ->get();

        return response()->json([
            'tasks' => TaskData::collect($tasks),
            'projects' => ProjectData::collect($projects),
            'sections' => SectionData::collect($sections),
            'tags' => TagData::collect($tags),
        ]);
    }
}
