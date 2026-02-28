<?php

namespace App\Http\Controllers\Api\V1;

use App\Data\ReminderData;
use App\Http\Controllers\Controller;
use App\Models\Reminder;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    /**
     * List reminders for a task.
     */
    public function index(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403);

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
        abort_unless($task->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'remind_at' => ['required', 'date', 'after:now'],
        ]);

        $reminder = $task->reminders()->create(array_merge($validated, ['is_sent' => false]));

        return response()->json([
            'data' => ReminderData::from($reminder),
        ], 201);
    }

    /**
     * Get a single reminder.
     */
    public function show(Request $request, Reminder $reminder): JsonResponse
    {
        abort_unless($reminder->task->user_id === $request->user()->id, 403);

        return response()->json([
            'data' => ReminderData::from($reminder),
        ]);
    }

    /**
     * Update a reminder.
     */
    public function update(Request $request, Reminder $reminder): JsonResponse
    {
        abort_unless($reminder->task->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'remind_at' => ['required', 'date', 'after:now'],
        ]);

        $reminder->update($validated);

        return response()->json([
            'data' => ReminderData::from($reminder),
        ]);
    }

    /**
     * Delete a reminder.
     */
    public function destroy(Request $request, Reminder $reminder): JsonResponse
    {
        abort_unless($reminder->task->user_id === $request->user()->id, 403);

        $reminder->delete();

        return response()->json(null, 204);
    }
}
