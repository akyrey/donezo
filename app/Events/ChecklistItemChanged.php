<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class ChecklistItemChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @param  array<int>  $groupIds  IDs of groups the parent task belongs to
     */
    public function __construct(
        public readonly int $taskId,
        public readonly int $userId,
        public readonly array $groupIds = [],
    ) {}

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel("App.Models.User.{$this->userId}"),
        ];

        foreach ($this->groupIds as $groupId) {
            $channels[] = new PrivateChannel("groups.{$groupId}");
        }

        return $channels;
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return ['task_id' => $this->taskId];
    }
}
