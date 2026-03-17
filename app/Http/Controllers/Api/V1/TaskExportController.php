<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\ExportTasksJob;
use App\Models\Group;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class TaskExportController extends Controller
{
    /**
     * Queue a CSV export for all of the authenticated user's tasks.
     *
     * Optional query parameters:
     *   - status (string)            Filter by task status
     *   - include_completed (bool)   Include completed/cancelled tasks (default false)
     */
    public function exportAll(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'string', 'in:inbox,today,upcoming,anytime,someday,completed,cancelled'],
            'include_completed' => ['sometimes', 'boolean'],
        ]);

        $filters = array_filter([
            'status' => $validated['status'] ?? null,
            'include_completed' => $validated['include_completed'] ?? false,
        ], fn ($v) => $v !== null);

        ExportTasksJob::dispatch($request->user()->id, $validated['status'] ?? 'all', $filters);

        return response()->json([
            'message' => 'Your export is being prepared. You will be notified when it is ready to download.',
        ]);
    }

    /**
     * Queue a CSV export for a specific project's tasks.
     * Only the project owner may request this export.
     */
    public function exportProject(Request $request, Project $project): JsonResponse
    {
        abort_unless($project->user_id === $request->user()->id, 403);

        ExportTasksJob::dispatch(
            $request->user()->id,
            'project',
            ['project_id' => $project->id],
        );

        return response()->json([
            'message' => 'Your export is being prepared. You will be notified when it is ready to download.',
        ]);
    }

    /**
     * Queue a CSV export for tasks shared with a specific group.
     * Accessible to group owners and members.
     */
    public function exportGroup(Request $request, Group $group): JsonResponse
    {
        $userId = $request->user()->id;
        $isMember = $group->members()->where('user_id', $userId)->exists();
        $isOwner = $group->owner_id === $userId;

        abort_unless($isMember || $isOwner, 403);

        ExportTasksJob::dispatch(
            $request->user()->id,
            'group',
            ['group_id' => $group->id],
        );

        return response()->json([
            'message' => 'Your export is being prepared. You will be notified when it is ready to download.',
        ]);
    }

    /**
     * Stream a previously generated CSV file to the browser.
     *
     * The `path` parameter is the storage path returned in the notification payload.
     * Only the authenticated user may download their own exports (path must start with "exports/").
     */
    public function download(Request $request): StreamedResponse|JsonResponse
    {
        $validated = $request->validate([
            'path' => ['required', 'string'],
        ]);

        $path = $validated['path'];

        // Security: only allow paths inside the exports/ directory
        if (!str_starts_with($path, 'exports/')) {
            abort(403, 'Invalid export path.');
        }

        if (!Storage::disk('local')->exists($path)) {
            return response()->json(['message' => 'Export file not found. It may have expired.'], 404);
        }

        $filename = basename($path);

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('local');

        return $disk->download($path, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
