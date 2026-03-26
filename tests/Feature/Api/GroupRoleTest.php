<?php

declare(strict_types=1);

use App\Models\Group;
use App\Models\Task;
use App\Models\User;

// ──────────────────────────────────────────────
// Task access: admin/member can CRUD tasks they don't own
// ──────────────────────────────────────────────

it('allows admin to view a task shared with the group that they did not create', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($admin)
        ->getJson("/api/v1/tasks/{$task->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $task->id);
});

it('allows member to view a task shared with the group that they did not create', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($member)
        ->getJson("/api/v1/tasks/{$task->id}")
        ->assertOk();
});

it('allows viewer to view a task shared with the group', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($viewer, 'viewer');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($viewer)
        ->getJson("/api/v1/tasks/{$task->id}")
        ->assertOk();
});

it('allows admin to update a task shared with the group that they did not create', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');

    $task = Task::factory()->for($owner)->inbox()->create(['title' => 'Original']);
    $group->tasks()->attach($task->id);

    $this->actingAs($admin)
        ->putJson("/api/v1/tasks/{$task->id}", ['title' => 'Updated by admin'])
        ->assertOk()
        ->assertJsonPath('data.title', 'Updated by admin');
});

it('allows member to update a task shared with the group that they did not create', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');

    $task = Task::factory()->for($owner)->inbox()->create(['title' => 'Original']);
    $group->tasks()->attach($task->id);

    $this->actingAs($member)
        ->putJson("/api/v1/tasks/{$task->id}", ['title' => 'Updated by member'])
        ->assertOk()
        ->assertJsonPath('data.title', 'Updated by member');
});

it('denies viewer from updating a task shared with the group', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($viewer, 'viewer');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($viewer)
        ->putJson("/api/v1/tasks/{$task->id}", ['title' => 'Attempt'])
        ->assertForbidden();
});

it('allows admin to delete a task shared with the group that they did not create', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($admin)
        ->deleteJson("/api/v1/tasks/{$task->id}")
        ->assertNoContent();
});

it('allows member to delete a task shared with the group that they did not create', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($member)
        ->deleteJson("/api/v1/tasks/{$task->id}")
        ->assertNoContent();
});

it('denies viewer from deleting a task shared with the group', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($viewer, 'viewer');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($viewer)
        ->deleteJson("/api/v1/tasks/{$task->id}")
        ->assertForbidden();
});

it('allows admin to complete a task shared with the group that they did not create', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($admin)
        ->postJson("/api/v1/tasks/{$task->id}/complete")
        ->assertOk();
});

it('denies viewer from completing a task shared with the group', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($viewer, 'viewer');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($viewer)
        ->postJson("/api/v1/tasks/{$task->id}/complete")
        ->assertForbidden();
});

it('denies non-group-member from accessing a task they do not own', function () {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');

    $task = Task::factory()->for($owner)->inbox()->create();
    $group->tasks()->attach($task->id);

    $this->actingAs($outsider)
        ->getJson("/api/v1/tasks/{$task->id}")
        ->assertForbidden();
});

// ──────────────────────────────────────────────
// Role update endpoint
// ──────────────────────────────────────────────

it('allows admin to update a member role', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');
    $group->addMember($member, 'member');

    $this->actingAs($admin)
        ->putJson("/api/v1/groups/{$group->id}/members/{$member->id}", ['role' => 'viewer'])
        ->assertOk();

    expect($group->members()->where('user_id', $member->id)->first()->pivot->role)->toBe('viewer');
});

it('denies member from updating another member role', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $other = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');
    $group->addMember($other, 'member');

    $this->actingAs($member)
        ->putJson("/api/v1/groups/{$group->id}/members/{$other->id}", ['role' => 'viewer'])
        ->assertForbidden();
});

it('denies viewer from updating any member role', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $other = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($viewer, 'viewer');
    $group->addMember($other, 'member');

    $this->actingAs($viewer)
        ->putJson("/api/v1/groups/{$group->id}/members/{$other->id}", ['role' => 'admin'])
        ->assertForbidden();
});

it('prevents changing the owner role', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');

    $this->actingAs($admin)
        ->putJson("/api/v1/groups/{$group->id}/members/{$owner->id}", ['role' => 'member'])
        ->assertUnprocessable();
});

it('validates the role value on update', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');

    $this->actingAs($owner)
        ->putJson("/api/v1/groups/{$group->id}/members/{$member->id}", ['role' => 'superuser'])
        ->assertUnprocessable();
});

// ──────────────────────────────────────────────
// Group management permissions
// ──────────────────────────────────────────────

it('allows admin to update group settings', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');

    $this->actingAs($admin)
        ->putJson("/api/v1/groups/{$group->id}", ['name' => 'New Name'])
        ->assertOk();
});

it('denies member from updating group settings', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');

    $this->actingAs($member)
        ->putJson("/api/v1/groups/{$group->id}", ['name' => 'New Name'])
        ->assertForbidden();
});

it('denies viewer from updating group settings', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($viewer, 'viewer');

    $this->actingAs($viewer)
        ->putJson("/api/v1/groups/{$group->id}", ['name' => 'New Name'])
        ->assertForbidden();
});

it('allows only the owner to delete the group', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');

    // Admin (non-owner) cannot delete
    $this->actingAs($admin)
        ->deleteJson("/api/v1/groups/{$group->id}")
        ->assertForbidden();

    // Owner can delete
    $this->actingAs($owner)
        ->deleteJson("/api/v1/groups/{$group->id}")
        ->assertNoContent();
});

// ──────────────────────────────────────────────
// Invitation permissions
// ──────────────────────────────────────────────

it('allows admin to invite members', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');

    $this->actingAs($admin)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'newuser@example.com',
            'role' => 'member',
        ])
        ->assertStatus(201);
});

it('denies member from inviting others', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');

    $this->actingAs($member)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'newuser@example.com',
            'role' => 'member',
        ])
        ->assertForbidden();
});

it('allows inviting with a viewer role', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'viewer@example.com',
            'role' => 'viewer',
        ])
        ->assertStatus(201);

    $this->assertDatabaseHas('group_invitations', [
        'group_id' => $group->id,
        'email' => 'viewer@example.com',
        'role' => 'viewer',
    ]);
});

it('allows admin to remove members', function () {
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $target = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($admin, 'admin');
    $group->addMember($target, 'member');

    $this->actingAs($admin)
        ->deleteJson("/api/v1/groups/{$group->id}/members/{$target->id}")
        ->assertOk();

    expect($group->members()->where('user_id', $target->id)->exists())->toBeFalse();
});

it('denies member from removing others', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $target = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->addMember($owner, 'admin');
    $group->addMember($member, 'member');
    $group->addMember($target, 'member');

    $this->actingAs($member)
        ->deleteJson("/api/v1/groups/{$group->id}/members/{$target->id}")
        ->assertForbidden();
});
