<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\SocialAccount;
use App\Models\Task;
use Exception;
use Google\Client as GoogleClient;
use Google\Service\Calendar as GoogleCalendar;
use Google\Service\Calendar\Event as GoogleCalendarEvent;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Support\Facades\Log;

final class GoogleCalendarService
{
    public const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
    private GoogleClient $client;

    public function __construct()
    {
        $this->client = new GoogleClient();
        $this->client->setClientId(config('services.google.client_id'));
        $this->client->setClientSecret(config('services.google.client_secret'));
        $this->client->setAccessType('offline');
        $this->client->setApprovalPrompt('force');
    }

    /**
     * Authenticate using a social account's stored tokens.
     */
    public function authenticate(SocialAccount $account): self
    {
        $this->client->setAccessToken([
            'access_token' => $account->provider_token,
            'refresh_token' => $account->provider_refresh_token,
            'expires_in' => $account->token_expires_at?->diffInSeconds(now()) ?? 0,
            'created' => $account->updated_at?->timestamp ?? time(),
        ]);

        if ($this->client->isAccessTokenExpired() && $account->provider_refresh_token) {
            $newToken = $this->client->fetchAccessTokenWithRefreshToken($account->provider_refresh_token);

            if (!isset($newToken['error'])) {
                $account->update([
                    'provider_token' => $newToken['access_token'],
                    'token_expires_at' => now()->addSeconds($newToken['expires_in'] ?? 3600),
                ]);
            } else {
                Log::error('Google Calendar token refresh failed', $newToken);
            }
        }

        return $this;
    }

    /**
     * Create a calendar event from a task.
     */
    public function createEvent(Task $task): ?string
    {
        try {
            $calendar = new GoogleCalendar($this->client);
            $event = $this->buildEventFromTask($task);

            $createdEvent = $calendar->events->insert('primary', $event);

            return $createdEvent->getId();
        } catch (Exception $e) {
            Log::error('Failed to create Google Calendar event', [
                'task_id' => $task->id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Update an existing calendar event from a task.
     */
    public function updateEvent(Task $task): bool
    {
        if (!$task->google_calendar_event_id) {
            return false;
        }

        try {
            $calendar = new GoogleCalendar($this->client);
            $event = $this->buildEventFromTask($task);

            $calendar->events->update('primary', $task->google_calendar_event_id, $event);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to update Google Calendar event', [
                'task_id' => $task->id,
                'event_id' => $task->google_calendar_event_id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Delete a calendar event.
     */
    public function deleteEvent(string $eventId): bool
    {
        try {
            $calendar = new GoogleCalendar($this->client);
            $calendar->events->delete('primary', $eventId);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to delete Google Calendar event', [
                'event_id' => $eventId,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Build a Google Calendar Event from a Task model.
     */
    private function buildEventFromTask(Task $task): GoogleCalendarEvent
    {
        $event = new GoogleCalendarEvent();
        $event->setSummary($task->title);

        if ($task->description) {
            $event->setDescription(strip_tags($task->description));
        }

        // Use deadline_at or scheduled_at for the event date/time
        $dateTime = $task->deadline_at ?? $task->scheduled_at ?? now();

        if ($task->is_evening) {
            // Set evening tasks to 6 PM
            $dateTime = $dateTime->copy()->setHour(18)->setMinute(0)->setSecond(0);
        }

        $start = new EventDateTime();
        $end = new EventDateTime();

        // If we have a specific time, use dateTime; otherwise use date (all-day event)
        if ($task->deadline_at && ($task->deadline_at->hour !== 0 || $task->deadline_at->minute !== 0)) {
            $start->setDateTime($dateTime->toRfc3339String());
            $start->setTimeZone($task->user?->timezone ?? 'UTC');
            $end->setDateTime($dateTime->copy()->addHour()->toRfc3339String());
            $end->setTimeZone($task->user?->timezone ?? 'UTC');
        } else {
            $start->setDate($dateTime->toDateString());
            $end->setDate($dateTime->copy()->addDay()->toDateString());
        }

        $event->setStart($start);
        $event->setEnd($end);

        // Add Donezo source metadata
        $event->setSource(new GoogleCalendar\EventSource([
            'title' => 'Donezo',
            'url' => config('app.url') . '/tasks/' . $task->id,
        ]));

        return $event;
    }

    /**
     * Check if the current token is valid and the user has calendar access.
     */
    public function isConnected(): bool
    {
        try {
            $calendar = new GoogleCalendar($this->client);
            $calendar->calendarList->listCalendarList(['maxResults' => 1]);

            return true;
        } catch (Exception) {
            return false;
        }
    }
}
