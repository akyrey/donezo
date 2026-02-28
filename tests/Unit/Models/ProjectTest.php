<?php

use App\Models\Heading;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $project = new Project();

    expect($project->getFillable())->toBe([
        'user_id',
        'section_id',
        'name',
        'description',
        'status',
        'position',
        'completed_at',
    ]);
});

it('casts attributes correctly', function () {
    $project = new Project();
    $casts = $project->getCasts();

    expect($casts)->toMatchArray([
        'completed_at' => 'datetime',
    ]);
});

it('belongs to user', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    expect($project->user)->toBeInstanceOf(User::class)
        ->and($project->user->id)->toBe($user->id);
});

it('has many tasks', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    Task::factory()->for($user)->count(3)->create(['project_id' => $project->id]);

    expect($project->tasks)->toHaveCount(3)
        ->and($project->tasks->first())->toBeInstanceOf(Task::class);
});

it('has many headings', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    Heading::factory()->for($project)->count(2)->create();

    expect($project->headings)->toHaveCount(2)
        ->and($project->headings->first())->toBeInstanceOf(Heading::class);
});

it('uses soft deletes', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    $project->delete();

    expect(Project::withTrashed()->find($project->id))->not->toBeNull()
        ->and(Project::find($project->id))->toBeNull();
});
