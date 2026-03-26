<?php

declare(strict_types=1);

use App\Jobs\ExportTasksJob;
use App\Models\Group;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskExportReadyNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

// ── Auth guards ──────────────────────────────────────────────────────────────

it('requires authentication to export all tasks', function () {
    $this->postJson('/api/v1/tasks/export')
        ->assertStatus(401);
});

it('requires authentication to export a project', function () {
    $project = Project::factory()->create();

    $this->postJson("/api/v1/projects/{$project->id}/export")
        ->assertStatus(401);
});

it('requires authentication to export a group', function () {
    $group = Group::factory()->create();

    $this->postJson("/api/v1/groups/{$group->id}/export")
        ->assertStatus(401);
});

// ── Export all tasks ─────────────────────────────────────────────────────────

it('queues an export job for all tasks', function () {
    Queue::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/export')
        ->assertOk()
        ->assertJsonStructure(['message']);

    Queue::assertPushed(ExportTasksJob::class, function (ExportTasksJob $job) use ($user) {
        return $job->userId === $user->id && $job->scope === 'all';
    });
});

it('queues an export job filtered by status', function () {
    Queue::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/export', ['status' => 'inbox'])
        ->assertOk();

    Queue::assertPushed(ExportTasksJob::class, function (ExportTasksJob $job) use ($user) {
        return $job->userId === $user->id
            && $job->scope === 'inbox'
            && ($job->filters['status'] ?? null) === 'inbox';
    });
});

it('rejects an invalid status when exporting all tasks', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/export', ['status' => 'bogus'])
        ->assertStatus(422);
});

// ── Export project tasks ─────────────────────────────────────────────────────

it('queues an export job for a project', function () {
    Queue::fake();

    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/v1/projects/{$project->id}/export")
        ->assertOk()
        ->assertJsonStructure(['message']);

    Queue::assertPushed(ExportTasksJob::class, function (ExportTasksJob $job) use ($user, $project) {
        return $job->userId === $user->id
            && $job->scope === 'project'
            && ($job->filters['project_id'] ?? null) === $project->id;
    });
});

it('forbids exporting another user\'s project', function () {
    Queue::fake();

    $owner = User::factory()->create();
    $other = User::factory()->create();
    $project = Project::factory()->for($owner)->create();

    $this->actingAs($other)
        ->postJson("/api/v1/projects/{$project->id}/export")
        ->assertStatus(403);

    Queue::assertNothingPushed();
});

// ── Export group tasks ───────────────────────────────────────────────────────

it('queues an export job for a group as owner', function () {
    Queue::fake();

    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/export")
        ->assertOk()
        ->assertJsonStructure(['message']);

    Queue::assertPushed(ExportTasksJob::class, function (ExportTasksJob $job) use ($owner, $group) {
        return $job->userId === $owner->id
            && $job->scope === 'group'
            && ($job->filters['group_id'] ?? null) === $group->id;
    });
});

it('queues an export job for a group as member', function () {
    Queue::fake();

    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');

    $this->actingAs($member)
        ->postJson("/api/v1/groups/{$group->id}/export")
        ->assertOk();

    Queue::assertPushed(ExportTasksJob::class);
});

it('forbids exporting a group the user does not belong to', function () {
    Queue::fake();

    $owner = User::factory()->create();
    $other = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');

    $this->actingAs($other)
        ->postJson("/api/v1/groups/{$group->id}/export")
        ->assertStatus(403);

    Queue::assertNothingPushed();
});

// ── Download endpoint ────────────────────────────────────────────────────────

it('requires authentication to download an export', function () {
    $this->getJson('/api/v1/exports/download?path=exports/test.csv')
        ->assertStatus(401);
});

it('returns 404 when the export file does not exist', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/exports/download?path=exports/nonexistent-file.csv')
        ->assertStatus(404);
});

it('rejects paths outside the exports directory', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/exports/download?path=../etc/passwd')
        ->assertStatus(403);
});

it('streams a CSV file when it exists', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $content = "title,status\nMy task,inbox\n";
    $path = 'exports/tasks-all-2026-01-01-abc12345.csv';

    Storage::disk('local')->put($path, $content);

    $response = $this->actingAs($user)
        ->get('/api/v1/exports/download?path=' . urlencode($path));

    $response->assertOk();
    // Laravel appends "; charset=utf-8" so we check the prefix
    expect($response->headers->get('Content-Type'))->toStartWith('text/csv');
});

// ── Job: ExportTasksJob ──────────────────────────────────────────────────────

it('job builds a csv and notifies the user', function () {
    Storage::fake('local');
    Notification::fake();

    $user = User::factory()->create();
    Task::factory()->for($user)->create(['title' => 'Exported task', 'status' => 'inbox']);

    $job = new ExportTasksJob($user->id, 'all', []);
    $job->handle();

    // A file should have been written under exports/
    $files = Storage::disk('local')->files('exports');
    expect($files)->toHaveCount(1);

    $csv = Storage::disk('local')->get($files[0]);
    expect($csv)->toContain('Exported task');
    expect($csv)->toContain('title,description,status');

    // User should have received a notification
    Notification::assertSentTo($user, TaskExportReadyNotification::class, function (TaskExportReadyNotification $n) {
        return str_ends_with($n->filename, '.csv')
            && str_starts_with($n->storagePath, 'exports/');
    });
});

it('job filters tasks by status', function () {
    Storage::fake('local');
    Notification::fake();

    $user = User::factory()->create();
    Task::factory()->for($user)->create(['title' => 'Inbox task',   'status' => 'inbox']);
    Task::factory()->for($user)->create(['title' => 'Someday task', 'status' => 'someday']);

    $job = new ExportTasksJob($user->id, 'inbox', ['status' => 'inbox']);
    $job->handle();

    $files = Storage::disk('local')->files('exports');
    $csv = Storage::disk('local')->get($files[0]);

    expect($csv)->toContain('Inbox task');
    expect($csv)->not->toContain('Someday task');
});

it('job exports only the specified project tasks', function () {
    Storage::fake('local');
    Notification::fake();

    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    Task::factory()->for($user)->for($project)->create(['title' => 'Project task']);
    Task::factory()->for($user)->create(['title' => 'Unrelated task']);

    $job = new ExportTasksJob($user->id, 'project', ['project_id' => $project->id]);
    $job->handle();

    $files = Storage::disk('local')->files('exports');
    $csv = Storage::disk('local')->get($files[0]);

    expect($csv)->toContain('Project task');
    expect($csv)->not->toContain('Unrelated task');
});

it('job exports only the specified group tasks', function () {
    Storage::fake('local');
    Notification::fake();

    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');

    $task = Task::factory()->for($owner)->create(['title' => 'Group task']);
    $group->tasks()->attach($task->id);

    Task::factory()->for($owner)->create(['title' => 'Unshared task']);

    $job = new ExportTasksJob($owner->id, 'group', ['group_id' => $group->id]);
    $job->handle();

    $files = Storage::disk('local')->files('exports');
    $csv = Storage::disk('local')->get($files[0]);

    expect($csv)->toContain('Group task');
    expect($csv)->not->toContain('Unshared task');
});

it('job produces only a header row when there are no tasks', function () {
    Storage::fake('local');
    Notification::fake();

    $user = User::factory()->create();

    $job = new ExportTasksJob($user->id, 'all', []);
    $job->handle();

    $files = Storage::disk('local')->files('exports');
    $csv = Storage::disk('local')->get($files[0]);
    $lines = array_filter(explode("\n", mb_trim($csv)));

    expect($lines)->toHaveCount(1); // Only the header row
});
