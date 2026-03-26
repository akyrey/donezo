<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Data\ReminderData;
use App\Events\ReminderChanged;
use App\Http\Controllers\Controller;
use App\Models\Reminder;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ReminderController extends Controller
{
    /**
     * List reminders for a task.
     */
    public function index(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        $reminders = $task->reminders()->orderBy('remind_at')->get();

        return response()->json([
            'data' => ReminderData::collect($reminders),
        ]);
    }

    /**
     * Create a reminder for a task.
     */
    public function store(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        $validated = $request->validate([
            'remind_at' => ['required', 'date', 'after:now'],
        ]);

        $reminder = $task->reminders()->create(array_merge($validated, ['is_sent' => false]));

        broadcast(new ReminderChanged($task->id, $task->user_id))->toOthers();

        return response()->json([
            'data' => ReminderData::from($reminder),
        ], 201);
    }

    /**
     * Get a single reminder.
     */
    public function show(Request $request, Reminder $reminder): JsonResponse
    {
        abort_unless($reminder->task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        return response()->json([
            'data' => ReminderData::from($reminder),
        ]);
    }

    /**
     * Update a reminder.
     */
    public function update(Request $request, Reminder $reminder): JsonResponse
    {
        abort_unless($reminder->task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        $validated = $request->validate([
            'remind_at' => ['required', 'date', 'after:now'],
        ]);

        $reminder->update($validated);

        $task = $reminder->task;
        broadcast(new ReminderChanged($task->id, $task->user_id))->toOthers();

        return response()->json([
            'data' => ReminderData::from($reminder),
        ]);
    }

    /**
     * Delete a reminder.
     */
    public function destroy(Request $request, Reminder $reminder): JsonResponse
    {
        abort_unless($reminder->task->isAccessibleBy($request->user(), 'group.manage-tasks'), 403);

        $task = $reminder->task;

        $reminder->delete();

        broadcast(new ReminderChanged($task->id, $task->user_id))->toOthers();

        return response()->json(null, 204);
    }
}
