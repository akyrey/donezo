<?php

namespace App\Jobs;

use App\Models\Task;
use App\Services\GoogleCalendarService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncTaskToCalendar implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        public readonly int $taskId,
    ) {}

    public function handle(GoogleCalendarService $service): void
    {
        $task = Task::with('user.socialAccounts')->find($this->taskId);

        if (! $task) {
            return;
        }

        if (! config('services.google.client_id') || ! env('GOOGLE_CALENDAR_ENABLED', false)) {
            return;
        }

        $googleAccount = $task->user->socialAccounts
            ->where('provider', 'google')
            ->first();

        if (! $googleAccount || ! $googleAccount->hasCalendarAccess()) {
            return;
        }

        $service->authenticate($googleAccount);

        if ($task->google_calendar_event_id) {
            // Update existing event
            $success = $service->updateEvent($task);

            if (! $success) {
                Log::warning('Failed to update calendar event for task', ['task_id' => $task->id]);
            }
        } else {
            // Create new event
            $eventId = $service->createEvent($task);

            if ($eventId) {
                $task->update(['google_calendar_event_id' => $eventId]);
            }
        }
    }
}
