<?php

namespace App\Jobs;

use App\Models\Group;
use App\Models\Project;
use App\Models\User;
use App\Notifications\TaskExportReadyNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ExportTasksJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    /**
     * @param  int    $userId     The user requesting the export
     * @param  string $scope      'all' | 'status' | 'project' | 'group'
     * @param  array<string, mixed>  $filters    e.g. ['status' => 'inbox'] | ['project_id' => 5] | ['group_id' => 2]
     */
    public function __construct(
        public readonly int $userId,
        public readonly string $scope,
        public readonly array $filters = [],
    ) {}

    public function handle(): void
    {
        $user = User::find($this->userId);

        if (! $user) {
            return;
        }

        $csv = $this->buildCsv($user);

        $filename = $this->buildFilename();
        $path = 'exports/' . $filename;

        Storage::disk('local')->put($path, $csv);

        $user->notify(new TaskExportReadyNotification($path, $filename));
    }

    // ─── CSV builder ────────────────────────────────────────────────────────────

    private function buildCsv(User $user): string
    {
        $tasks = $this->fetchTasks($user);

        $handle = fopen('php://temp', 'r+');

        // Header row
        fputcsv($handle, [
            'title',
            'description',
            'status',
            'project',
            'tags',
            'scheduled_at',
            'deadline_at',
            'completed_at',
            'is_evening',
            'created_at',
        ]);

        foreach ($tasks as $task) {
            fputcsv($handle, [
                $task->title,
                $task->description ?? '',
                $task->status,
                $task->project?->name ?? '',
                $task->tags->pluck('name')->join(', '),
                $task->scheduled_at?->toIso8601String() ?? '',
                $task->deadline_at?->toIso8601String() ?? '',
                $task->completed_at?->toIso8601String() ?? '',
                $task->is_evening ? 'true' : 'false',
                $task->created_at->toIso8601String(),
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return $csv ?: '';
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task>
     */
    private function fetchTasks(User $user): \Illuminate\Database\Eloquent\Collection
    {
        $eagerLoads = ['tags', 'project'];

        return match ($this->scope) {
            'project' => $this->fetchProjectTasks($user, $eagerLoads),
            'group'   => $this->fetchGroupTasks($user, $eagerLoads),
            default   => $this->fetchUserTasks($user, $eagerLoads),
        };
    }

    /**
     * @param  array<int, string>  $eagerLoads
     * @return \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task>
     */
    private function fetchUserTasks(User $user, array $eagerLoads): \Illuminate\Database\Eloquent\Collection
    {
        $query = $user->tasks()->with($eagerLoads);

        if (isset($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! ($this->filters['include_completed'] ?? false)) {
            $query->whereNull('completed_at')->whereNull('cancelled_at');
        }

        return $query->orderBy('position')->get();
    }

    /**
     * @param  array<int, string>  $eagerLoads
     * @return \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task>
     */
    private function fetchProjectTasks(User $user, array $eagerLoads): \Illuminate\Database\Eloquent\Collection
    {
        $projectId = $this->filters['project_id'] ?? null;

        if (! $projectId) {
            return $user->tasks()->with($eagerLoads)->whereNull('completed_at')->whereNull('cancelled_at')->orderBy('position')->get();
        }

        $project = Project::find($projectId);

        if (! $project || $project->user_id !== $user->id) {
            return new \Illuminate\Database\Eloquent\Collection();
        }

        return $project->tasks()->with($eagerLoads)->orderBy('position')->get();
    }

    /**
     * @param  array<int, string>  $eagerLoads
     * @return \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task>
     */
    private function fetchGroupTasks(User $user, array $eagerLoads): \Illuminate\Database\Eloquent\Collection
    {
        $groupId = $this->filters['group_id'] ?? null;

        if (! $groupId) {
            return new \Illuminate\Database\Eloquent\Collection();
        }

        $group = Group::find($groupId);

        if (! $group) {
            return new \Illuminate\Database\Eloquent\Collection();
        }

        $isMember = $group->members()->where('user_id', $user->id)->exists();
        $isOwner  = $group->owner_id === $user->id;

        if (! $isMember && ! $isOwner) {
            return new \Illuminate\Database\Eloquent\Collection();
        }

        return $group->tasks()->with($eagerLoads)->orderBy('tasks.created_at')->get();
    }

    // ─── Filename ────────────────────────────────────────────────────────────────

    private function buildFilename(): string
    {
        $date = now()->format('Y-m-d');

        $slug = match ($this->scope) {
            'project' => 'project-' . ($this->filters['project_id'] ?? 'unknown'),
            'group'   => 'group-' . ($this->filters['group_id'] ?? 'unknown'),
            'status'  => ($this->filters['status'] ?? 'tasks'),
            default   => 'all-tasks',
        };

        return 'tasks-' . Str::slug($slug) . '-' . $date . '-' . Str::random(8) . '.csv';
    }
}
