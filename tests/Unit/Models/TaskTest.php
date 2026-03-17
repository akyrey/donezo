<?php

declare(strict_types=1);

use App\Models\ChecklistItem;
use App\Models\Project;
use App\Models\Reminder;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $task = new Task();

    expect($task->getFillable())->toBe([
        'user_id',
        'project_id',
        'section_id',
        'heading_id',
        'title',
        'description',
        'status',
        'previous_status',
        'is_evening',
        'scheduled_at',
        'deadline_at',
        'completed_at',
        'cancelled_at',
        'repeat_rule',
        'position',
        'created_by',
        'assigned_to',
        'google_calendar_event_id',
    ]);
});

it('casts attributes correctly', function () {
    $task = new Task();
    $casts = $task->getCasts();

    expect($casts)->toMatchArray([
        'is_evening' => 'boolean',
        'scheduled_at' => 'datetime',
        'deadline_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'repeat_rule' => 'array',
    ]);
});

it('belongs to user', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    expect($task->user)->toBeInstanceOf(User::class)
        ->and($task->user->id)->toBe($user->id);
});

it('belongs to a project', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $task = Task::factory()->for($user)->create(['project_id' => $project->id]);

    expect($task->project)->toBeInstanceOf(Project::class)
        ->and($task->project->id)->toBe($project->id);
});

it('has many checklist items', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $task->checklistItems()->create(['title' => 'Item 1', 'position' => 0]);
    $task->checklistItems()->create(['title' => 'Item 2', 'position' => 1]);

    expect($task->checklistItems)->toHaveCount(2)
        ->and($task->checklistItems->first())->toBeInstanceOf(ChecklistItem::class);
});

it('has many reminders', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $task->reminders()->create(['remind_at' => now()->addHour()]);

    expect($task->reminders)->toHaveCount(1)
        ->and($task->reminders->first())->toBeInstanceOf(Reminder::class);
});

it('belongs to many tags', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $tag = Tag::factory()->for($user)->create();
    $task->tags()->attach($tag);

    expect($task->tags)->toHaveCount(1)
        ->and($task->tags->first())->toBeInstanceOf(Tag::class)
        ->and($task->tags->first()->id)->toBe($tag->id);
});

it('scopes by inbox status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->inbox()->create();
    Task::factory()->for($user)->today()->create();

    $inboxTasks = Task::inbox()->get();

    expect($inboxTasks)->toHaveCount(1)
        ->and($inboxTasks->first()->status)->toBe('inbox');
});

it('scopes by today status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->today()->create();
    Task::factory()->for($user)->inbox()->create();

    $todayTasks = Task::today()->get();

    expect($todayTasks)->toHaveCount(1)
        ->and($todayTasks->first()->status)->toBe('today');
});

it('scopes by upcoming status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create(['status' => 'upcoming']);
    Task::factory()->for($user)->inbox()->create();

    $upcomingTasks = Task::upcoming()->get();

    expect($upcomingTasks)->toHaveCount(1)
        ->and($upcomingTasks->first()->status)->toBe('upcoming');
});

it('scopes by anytime status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create(['status' => 'anytime']);
    Task::factory()->for($user)->inbox()->create();

    $anytimeTasks = Task::anytime()->get();

    expect($anytimeTasks)->toHaveCount(1)
        ->and($anytimeTasks->first()->status)->toBe('anytime');
});

it('scopes by someday status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create(['status' => 'someday']);
    Task::factory()->for($user)->inbox()->create();

    $somedayTasks = Task::someday()->get();

    expect($somedayTasks)->toHaveCount(1)
        ->and($somedayTasks->first()->status)->toBe('someday');
});

it('scopes by completed status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->completed()->create();
    Task::factory()->for($user)->inbox()->create();

    $completedTasks = Task::completed()->get();

    expect($completedTasks)->toHaveCount(1)
        ->and($completedTasks->first()->status)->toBe('completed');
});

it('scopes by cancelled status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->cancelled()->create();
    Task::factory()->for($user)->inbox()->create();

    $cancelledTasks = Task::cancelled()->get();

    expect($cancelledTasks)->toHaveCount(1)
        ->and($cancelledTasks->first()->status)->toBe('cancelled');
});

it('scopes by evening', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->evening()->create();
    Task::factory()->for($user)->create(['is_evening' => false]);

    $eveningTasks = Task::evening()->get();

    expect($eveningTasks)->toHaveCount(1)
        ->and($eveningTasks->first()->is_evening)->toBeTrue();
});

it('uses soft deletes', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $task->delete();

    expect(Task::withTrashed()->find($task->id))->not->toBeNull()
        ->and(Task::find($task->id))->toBeNull();
});
