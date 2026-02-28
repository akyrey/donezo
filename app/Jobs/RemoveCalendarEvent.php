<?php

namespace App\Jobs;

use App\Models\SocialAccount;
use App\Services\GoogleCalendarService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RemoveCalendarEvent implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(
        public readonly string $eventId,
        public readonly int $socialAccountId,
    ) {}

    public function handle(GoogleCalendarService $service): void
    {
        if (! config('services.google.client_id') || ! env('GOOGLE_CALENDAR_ENABLED', false)) {
            return;
        }

        $socialAccount = SocialAccount::find($this->socialAccountId);

        if (! $socialAccount) {
            return;
        }

        $service->authenticate($socialAccount);
        $service->deleteEvent($this->eventId);
    }
}
