<?php

use App\Models\Group;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $group = new Group();

    expect($group->getFillable())->toMatchArray([
        'name', 'description', 'owner_id',
    ]);
});

it('belongs to an owner', function () {
    $user = User::factory()->create();
    $group = Group::factory()->forUser($user)->create();

    expect($group->owner)->toBeInstanceOf(User::class);
    expect($group->owner->id)->toBe($user->id);
});

it('has many members via pivot', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($member->id, ['role' => 'member']);

    expect($group->members)->toHaveCount(2);
    expect($group->members->first()->pivot->role)->toBe('admin');
});

it('has many tasks via pivot', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $task1 = Task::factory()->for($owner)->create();
    $task2 = Task::factory()->for($owner)->create();
    $group->tasks()->attach([$task1->id, $task2->id]);

    expect($group->tasks)->toHaveCount(2);
});

it('uses soft deletes', function () {
    $user = User::factory()->create();
    $group = Group::factory()->forUser($user)->create();
    $group->delete();

    expect($group->trashed())->toBeTrue();
    expect(Group::withTrashed()->find($group->id))->not->toBeNull();
    expect(Group::find($group->id))->toBeNull();
});
