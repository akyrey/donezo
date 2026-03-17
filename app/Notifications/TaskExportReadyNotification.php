<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

final class TaskExportReadyNotification extends Notification
{
    use Queueable;

    /**
     * @param string $storagePath Path on the 'local' disk, e.g. "exports/tasks-all-2026-03-17-abc12345.csv"
     * @param string $filename    Human-readable filename shown in the notification
     */
    public function __construct(
        public readonly string $storagePath,
        public readonly string $filename,
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
            'type' => 'export_ready',
            'storage_path' => $this->storagePath,
            'filename' => $this->filename,
            'download_url' => route('api.v1.exports.download', ['path' => $this->storagePath]),
        ];
    }

    /**
     * Get the push notification payload (for Web Push channel consumers).
     *
     * @return array<string, mixed>
     */
    public function toPush(): array
    {
        return [
            'title' => 'Your export is ready',
            'body' => $this->filename . ' is ready to download.',
            'icon' => '/images/icon-192.png',
            'badge' => '/images/badge-72.png',
            'data' => [
                'type' => 'export_ready',
                'storage_path' => $this->storagePath,
                'filename' => $this->filename,
            ],
        ];
    }
}
