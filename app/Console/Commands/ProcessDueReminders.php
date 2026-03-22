<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\PushSubscription;
use App\Models\Reminder;
use App\Notifications\ReminderDueNotification;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

final class ProcessDueReminders extends Command
{
    protected $signature = 'reminders:process';
    protected $description = 'Process due reminders and send push notifications';

    public function handle(): int
    {
        $dueReminders = Reminder::with(['task.user.pushSubscriptions'])
            ->where('is_sent', false)
            ->where('remind_at', '<=', now())
            ->get();

        if ($dueReminders->isEmpty()) {
            $this->info('No due reminders found.');

            return self::SUCCESS;
        }

        $this->info("Processing {$dueReminders->count()} due reminders...");

        foreach ($dueReminders as $reminder) {
            $user = $reminder->task->user;

            if (!$user) {
                continue;
            }

            // Send database notification
            $user->notify(new ReminderDueNotification($reminder));

            // Send push notifications
            $this->sendPushNotifications($user->pushSubscriptions, $reminder);

            // Mark as sent
            $reminder->update(['is_sent' => true]);

            $this->line("  Sent reminder #{$reminder->id} for task: {$reminder->task->title}");
        }

        $this->info('Done.');

        return self::SUCCESS;
    }

    /**
     * Send push notifications to all user subscriptions.
     *
     * @param \Illuminate\Database\Eloquent\Collection<int, PushSubscription> $subscriptions
     */
    private function sendPushNotifications($subscriptions, Reminder $reminder): void
    {
        if ($subscriptions->isEmpty()) {
            return;
        }

        $vapidPublicKey = config('services.vapid.public_key');
        $vapidPrivateKey = config('services.vapid.private_key');
        $vapidSubject = config('services.vapid.subject') ?? config('app.url');

        if (!$vapidPublicKey || !$vapidPrivateKey) {
            Log::warning('VAPID keys not configured, skipping push notifications.');

            return;
        }

        try {
            $auth = [
                'VAPID' => [
                    'subject' => $vapidSubject,
                    'publicKey' => $vapidPublicKey,
                    'privateKey' => $vapidPrivateKey,
                ],
            ];

            $webPush = new WebPush($auth);

            $notification = new ReminderDueNotification($reminder);
            $payload = json_encode($notification->toPush());

            foreach ($subscriptions as $sub) {
                $subscription = Subscription::create([
                    'endpoint' => $sub->endpoint,
                    'publicKey' => $sub->p256dh_key,
                    'authToken' => $sub->auth_token,
                    'contentEncoding' => $sub->content_encoding ?? 'aesgcm',
                ]);

                $webPush->queueNotification($subscription, $payload);
            }

            foreach ($webPush->flush() as $report) {
                if (!$report->isSuccess()) {
                    Log::warning('Push notification failed', [
                        'endpoint' => $report->getEndpoint(),
                        'reason' => $report->getReason(),
                    ]);

                    // Remove expired subscriptions
                    if ($report->isSubscriptionExpired()) {
                        PushSubscription::where('endpoint', $report->getEndpoint())->delete();
                    }
                }
            }
        } catch (Exception $e) {
            Log::error('Failed to send push notifications', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
