<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Data\CreateTaskData;
use App\Data\TaskData;
use App\Data\UpdateTaskData;
use App\Events\TaskCompleted;
use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use App\Events\TasksReordered;
use App\Events\TaskUncompleted;
use App\Events\TaskUpdated;
use App\Http\Controllers\Controller;
use App\Jobs\RemoveCalendarEvent;
use App\Jobs\SyncTaskToCalendar;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\Optional;

final class TaskController extends Controller
{
    /**
     * List tasks with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->tasks()->with(['tags', 'checklistItems', 'reminders', 'project']);

        if ($request->has('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->has('project_id')) {
            $query->where('project_id', $request->integer('project_id'));
        }

        if ($request->has('section_id')) {
            $query->where('section_id', $request->integer('section_id'));
        }

        if ($request->has('heading_id')) {
            $query->where('heading_id', $request->integer('heading_id'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->integer('tag'));
            });
        }

        if ($request->boolean('completed')) {
            $query->whereNotNull('completed_at');
        } else {
            $query->whereNull('completed_at')->whereNull('cancelled_at');
        }

        $tasks = $query->orderBy('position')->paginate($request->integer('per_page', 50));

        return response()->json([
            'data' => TaskData::collect($tasks->items()),
            'meta' => [
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
            ],
        ]);
    }

    /**
     * Create a new task.
     */
    public function store(CreateTaskData $data, Request $request): JsonResponse
    {
        $maxPosition = $request->user()->tasks()->max('position') ?? 0;

        $task = $request->user()->tasks()->create([
            'title' => $data->title,
            'description' => $data->description,
            'status' => $data->status,
            'is_evening' => $data->is_evening,
            'scheduled_at' => $data->scheduled_at,
            'deadline_at' => $data->deadline_at,
            'repeat_rule' => $data->repeat_rule?->toArray(),
            'project_id' => $data->project_id,
            'section_id' => $data->section_id,
            'heading_id' => $data->heading_id,
            'assigned_to' => $data->assigned_to,
            'created_by' => $request->user()->id,
            'position' => $maxPosition + 1,
        ]);

        if ($data->tags) {
            $task->tags()->sync($data->tags);
        }

        if ($data->checklist_items) {
            foreach ($data->checklist_items as $index => $item) {
                $task->checklistItems()->create([
                    'title' => $item['title'],
                    'position' => $index,
                ]);
            }
        }

        if ($data->reminders) {
            foreach ($data->reminders as $reminder) {
                $task->reminders()->create([
                    'remind_at' => $reminder['remind_at'],
                ]);
            }
        }

        $task->load(['tags', 'checklistItems', 'reminders', 'creator', 'assignee', 'groups']);

        // Dispatch calendar sync if task has a date
        if ($task->scheduled_at || $task->deadline_at) {
            SyncTaskToCalendar::dispatch($task->id);
        }

        broadcast(new TaskCreated($task))->toOthers();

        return response()->json([
            'data' => TaskData::from($task),
        ], 201);
    }

    /**
     * Get a single task.
     */
    public function show(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        $task->load(['tags', 'checklistItems', 'reminders', 'creator', 'assignee', 'project']);

        return response()->json([
            'data' => TaskData::from($task),
        ]);
    }

    /**
     * Update a task.
     */
    public function update(UpdateTaskData $data, Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        $attributes = [];

        if (!$data->title instanceof Optional) {
            $attributes['title'] = $data->title;
        }
        if (!$data->description instanceof Optional) {
            $attributes['description'] = $data->description;
        }
        if (!$data->status instanceof Optional) {
            $attributes['status'] = $data->status;
        }
        if (!$data->is_evening instanceof Optional) {
            $attributes['is_evening'] = $data->is_evening;
        }
        if (!$data->scheduled_at instanceof Optional) {
            $attributes['scheduled_at'] = $data->scheduled_at;
        }
        if (!$data->deadline_at instanceof Optional) {
            $attributes['deadline_at'] = $data->deadline_at;
        }
        if (!$data->repeat_rule instanceof Optional) {
            $attributes['repeat_rule'] = $data->repeat_rule?->toArray();
        }
        if (!$data->project_id instanceof Optional) {
            $attributes['project_id'] = $data->project_id;
        }
        if (!$data->section_id instanceof Optional) {
            $attributes['section_id'] = $data->section_id;
        }
        if (!$data->heading_id instanceof Optional) {
            $attributes['heading_id'] = $data->heading_id;
        }
        if (!$data->assigned_to instanceof Optional) {
            $attributes['assigned_to'] = $data->assigned_to;
        }

        $task->update($attributes);

        if (!$data->tags instanceof Optional) {
            $task->tags()->sync($data->tags);
        }

        $task->load(['tags', 'checklistItems', 'reminders', 'creator', 'assignee', 'project', 'groups']);

        // Dispatch calendar sync if task has calendar-relevant changes
        $calendarFields = ['title', 'description', 'scheduled_at', 'deadline_at', 'is_evening'];
        $hasCalendarChanges = !empty(array_intersect(array_keys($attributes), $calendarFields));

        if ($hasCalendarChanges && ($task->scheduled_at || $task->deadline_at)) {
            SyncTaskToCalendar::dispatch($task->id);
        }

        broadcast(new TaskUpdated($task))->toOthers();

        return response()->json([
            'data' => TaskData::from($task),
        ]);
    }

    /**
     * Soft delete a task.
     */
    public function destroy(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        // Capture group IDs before deletion
        $groupIds = $task->groups()->pluck('groups.id')->toArray();

        // Remove calendar event if synced
        if ($task->google_calendar_event_id) {
            $googleAccount = $request->user()->socialAccounts()
                ->where('provider', 'google')
                ->first();

            if ($googleAccount) {
                RemoveCalendarEvent::dispatch(
                    $task->google_calendar_event_id,
                    $googleAccount->id,
                );
            }
        }

        $task->delete();

        broadcast(new TaskDeleted($task->id, $task->user_id, $groupIds))->toOthers();

        return response()->json(null, 204);
    }

    /**
     * Mark a task as complete.
     */
    public function complete(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        $task->update([
            'previous_status' => $task->status,
            'status' => 'completed',
            'completed_at' => Carbon::now(),
        ]);

        // Remove calendar event when task is completed
        if ($task->google_calendar_event_id) {
            $googleAccount = $request->user()->socialAccounts()
                ->where('provider', 'google')
                ->first();

            if ($googleAccount) {
                RemoveCalendarEvent::dispatch(
                    $task->google_calendar_event_id,
                    $googleAccount->id,
                );
            }

            $task->update(['google_calendar_event_id' => null]);
        }

        $task->load(['tags', 'checklistItems', 'reminders', 'creator', 'assignee', 'groups']);

        broadcast(new TaskCompleted($task))->toOthers();

        return response()->json([
            'data' => TaskData::from($task),
        ]);
    }

    /**
     * Unmark a task as complete.
     */
    public function uncomplete(Request $request, Task $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        $task->update([
            'status' => $task->previous_status ?? 'inbox',
            'previous_status' => null,
            'completed_at' => null,
        ]);

        // Re-sync to calendar if task has a date
        if ($task->scheduled_at || $task->deadline_at) {
            SyncTaskToCalendar::dispatch($task->id);
        }

        $task->load(['tags', 'checklistItems', 'reminders', 'creator', 'assignee', 'groups']);

        broadcast(new TaskUncompleted($task))->toOthers();

        return response()->json([
            'data' => TaskData::from($task),
        ]);
    }

    /**
     * Batch reorder tasks.
     * Optionally update heading_id when tasks are moved between headings.
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tasks' => ['required', 'array'],
            'tasks.*.id' => ['required', 'integer', 'exists:tasks,id'],
            'tasks.*.position' => ['required', 'integer', 'min:0'],
            'tasks.*.heading_id' => ['sometimes', 'nullable', 'integer', 'exists:headings,id'],
        ]);

        $userId = $request->user()->id;

        foreach ($validated['tasks'] as $item) {
            $update = ['position' => $item['position']];

            if (array_key_exists('heading_id', $item)) {
                $update['heading_id'] = $item['heading_id'];
            }

            Task::where('id', $item['id'])
                ->where('user_id', $userId)
                ->update($update);
        }

        broadcast(new TasksReordered($userId))->toOthers();

        return response()->json(['message' => 'Tasks reordered successfully.']);
    }
}
