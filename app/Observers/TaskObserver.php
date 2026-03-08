<?php

namespace App\Observers;

use App\Models\Task;
use Illuminate\Support\Facades\Cache;

class TaskObserver
{
    /**
     * The cache key for a user's sidebar task counts.
     */
    public static function cacheKey(int $userId): string
    {
        return "user:{$userId}:task_counts";
    }

    public function created(Task $task): void
    {
        $this->clearTaskCounts($task);
    }

    public function updated(Task $task): void
    {
        // Only bust the cache when count-relevant fields changed
        if ($task->wasChanged(['status', 'completed_at', 'cancelled_at'])) {
            $this->clearTaskCounts($task);
        }
    }

    public function deleted(Task $task): void
    {
        $this->clearTaskCounts($task);
    }

    public function restored(Task $task): void
    {
        $this->clearTaskCounts($task);
    }

    private function clearTaskCounts(Task $task): void
    {
        Cache::forget(self::cacheKey($task->user_id));
    }
}
