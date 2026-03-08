<?php

use App\Models\Group;
use App\Models\Task;
use App\Models\User;

it('requires authentication to list groups', function () {
    $this->getJson('/api/v1/groups')
        ->assertStatus(401);
});

it('can list own groups', function () {
    $user = User::factory()->create();
    $ownedGroup = Group::factory()->forUser($user)->create();
    $ownedGroup->members()->attach($user->id, ['role' => 'admin']);

    $memberGroup = Group::factory()->create();
    $memberGroup->members()->attach($user->id, ['role' => 'member']);

    // Another user's group (should not appear)
    Group::factory()->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/groups')
        ->assertOk();

    $response->assertJsonCount(2, 'data');
});

it('can create a group', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/groups', [
            'name' => 'Engineering Team',
            'description' => 'The engineering department',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.name', 'Engineering Team');

    $this->assertDatabaseHas('groups', [
        'name' => 'Engineering Team',
        'owner_id' => $user->id,
    ]);

    // Owner should be auto-added as admin member
    $group = Group::where('name', 'Engineering Team')->first();
    expect($group->members()->where('user_id', $user->id)->first()->pivot->role)->toBe('admin');
});

it('can show a group with members', function () {
    $user = User::factory()->create();
    $group = Group::factory()->forUser($user)->create();
    $group->members()->attach($user->id, ['role' => 'admin']);

    $this->actingAs($user)
        ->getJson("/api/v1/groups/{$group->id}")
        ->assertOk()
        ->assertJsonPath('data.name', $group->name)
        ->assertJsonStructure(['data', 'members']);
});

it('can update a group as owner', function () {
    $user = User::factory()->create();
    $group = Group::factory()->forUser($user)->create();

    $this->actingAs($user)
        ->putJson("/api/v1/groups/{$group->id}", [
            'name' => 'Updated Name',
        ])
        ->assertOk()
        ->assertJsonPath('data.name', 'Updated Name');

    $this->assertDatabaseHas('groups', [
        'id' => $group->id,
        'name' => 'Updated Name',
    ]);
});

it('can delete a group as owner', function () {
    $user = User::factory()->create();
    $group = Group::factory()->forUser($user)->create();
    $group->members()->attach($user->id, ['role' => 'admin']);

    $this->actingAs($user)
        ->deleteJson("/api/v1/groups/{$group->id}")
        ->assertStatus(204);

    $this->assertSoftDeleted('groups', ['id' => $group->id]);
});



it('can remove a member from a group', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($member->id, ['role' => 'member']);

    $this->actingAs($owner)
        ->deleteJson("/api/v1/groups/{$group->id}/members/{$member->id}")
        ->assertOk();

    expect($group->members()->where('user_id', $member->id)->exists())->toBeFalse();
});

it('prevents removing the group owner', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $this->actingAs($owner)
        ->deleteJson("/api/v1/groups/{$group->id}/members/{$owner->id}")
        ->assertStatus(422);
});

it('can share tasks with a group', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $task1 = Task::factory()->for($owner)->create();
    $task2 = Task::factory()->for($owner)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/tasks", [
            'task_ids' => [$task1->id, $task2->id],
        ])
        ->assertOk()
        ->assertJsonCount(2, 'data');

    expect($group->tasks()->count())->toBe(2);
});

it('only shares tasks owned by the user', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $ownTask = Task::factory()->for($owner)->create();
    $otherTask = Task::factory()->for($otherUser)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/tasks", [
            'task_ids' => [$ownTask->id, $otherTask->id],
        ])
        ->assertOk();

    // Only the user's own task should be shared
    expect($group->tasks()->count())->toBe(1);
    expect($group->tasks()->first()->id)->toBe($ownTask->id);
});

it('prevents non-owners from updating or deleting a group', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($member->id, ['role' => 'member']);

    $this->actingAs($member)
        ->putJson("/api/v1/groups/{$group->id}", ['name' => 'Hacked'])
        ->assertStatus(403);

    $this->actingAs($member)
        ->deleteJson("/api/v1/groups/{$group->id}")
        ->assertStatus(403);
});

it('prevents non-members from viewing a group', function () {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $this->actingAs($outsider)
        ->getJson("/api/v1/groups/{$group->id}")
        ->assertStatus(403);
});

it('prevents non-owners from managing members', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($member->id, ['role' => 'member']);

    $this->actingAs($member)
        ->deleteJson("/api/v1/groups/{$group->id}/members/{$owner->id}")
        ->assertStatus(403);
});

it('validates name is required when creating a group', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/groups', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});
