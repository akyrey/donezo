<?php

namespace App\Notifications;

use App\Models\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReminderDueNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Reminder $reminder,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'reminder',
            'reminder_id' => $this->reminder->id,
            'task_id' => $this->reminder->task_id,
            'task_title' => $this->reminder->task->title,
            'remind_at' => $this->reminder->remind_at->toIso8601String(),
        ];
    }

    /**
     * Get the push notification payload.
     *
     * @return array<string, mixed>
     */
    public function toPush(): array
    {
        return [
            'title' => 'Reminder: ' . $this->reminder->task->title,
            'body' => $this->reminder->task->description
                ? substr(strip_tags($this->reminder->task->description), 0, 100)
                : 'You have a task reminder.',
            'icon' => '/images/icon-192.png',
            'badge' => '/images/badge-72.png',
            'data' => [
                'task_id' => $this->reminder->task_id,
                'url' => '/inbox',
            ],
        ];
    }
}
