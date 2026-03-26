<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Data\ChecklistItemData;
use App\Events\ChecklistItemChanged;
use App\Http\Controllers\Controller;
use App\Models\ChecklistItem;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ChecklistItemController extends Controller
{
    /**
     * List checklist items for a task.
     */
    public function index(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->isAccessibleBy($request->user(), 'group.view-tasks'), 403);

        $items = $task->checklistItems()->orderBy('position')->get();

        return response()->json([
            'data' => ChecklistItemData::collect($items),
        ]);
    }

    /**
     * Create a checklist item for a task.
     */
    public function store(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:500'],
        ]);

        $maxPosition = $task->checklistItems()->max('position') ?? -1;

        $item = $task->checklistItems()->create([
            'title' => $validated['title'],
            'position' => $maxPosition + 1,
            'is_completed' => false,
        ]);

        $groupIds = $task->groups()->pluck('groups.id')->toArray();
        broadcast(new ChecklistItemChanged($task->id, $task->user_id, $groupIds))->toOthers();

        return response()->json([
            'data' => ChecklistItemData::from($item),
        ], 201);
    }

    /**
     * Get a single checklist item.
     */
    public function show(Request $request, ChecklistItem $checklistItem): JsonResponse
    {
        abort_unless($checklistItem->task->isAccessibleBy($request->user(), 'group.view-tasks'), 403);

        return response()->json([
            'data' => ChecklistItemData::from($checklistItem),
        ]);
    }

    /**
     * Update a checklist item.
     */
    public function update(Request $request, ChecklistItem $checklistItem): JsonResponse
    {
        abort_unless($checklistItem->task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:500'],
            'is_completed' => ['sometimes', 'boolean'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        $checklistItem->update($validated);

        $task = $checklistItem->task;
        $groupIds = $task->groups()->pluck('groups.id')->toArray();
        broadcast(new ChecklistItemChanged($task->id, $task->user_id, $groupIds))->toOthers();

        return response()->json([
            'data' => ChecklistItemData::from($checklistItem),
        ]);
    }

    /**
     * Delete a checklist item.
     */
    public function destroy(Request $request, ChecklistItem $checklistItem): JsonResponse
    {
        abort_unless($checklistItem->task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        $task = $checklistItem->task;
        $groupIds = $task->groups()->pluck('groups.id')->toArray();

        $checklistItem->delete();

        broadcast(new ChecklistItemChanged($task->id, $task->user_id, $groupIds))->toOthers();

        return response()->json(null, 204);
    }

    /**
     * Toggle a checklist item's completed state.
     */
    public function toggle(Request $request, ChecklistItem $checklistItem): JsonResponse
    {
        abort_unless($checklistItem->task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        $checklistItem->update([
            'is_completed' => !$checklistItem->is_completed,
        ]);

        $task = $checklistItem->task;
        $groupIds = $task->groups()->pluck('groups.id')->toArray();
        broadcast(new ChecklistItemChanged($task->id, $task->user_id, $groupIds))->toOthers();

        return response()->json([
            'data' => ChecklistItemData::from($checklistItem),
        ]);
    }
}
