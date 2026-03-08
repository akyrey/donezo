<?php

use App\Mail\GroupInvitationMail;
use App\Models\Group;
use App\Models\GroupInvitation;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

// ── Authentication ────────────────────────────────────────────────────────────

it('requires authentication to send an invitation', function () {
    $group = Group::factory()->create();

    $this->postJson("/api/v1/groups/{$group->id}/invitations", ['email' => 'a@b.com'])
        ->assertStatus(401);
});

it('requires authentication to list invitations', function () {
    $group = Group::factory()->create();

    $this->getJson("/api/v1/groups/{$group->id}/invitations")
        ->assertStatus(401);
});

it('requires authentication to accept an invitation', function () {
    $invitation = GroupInvitation::factory()->pending()->create();

    $this->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertStatus(401);
});

// ── Send invitation ───────────────────────────────────────────────────────────

it('owner can invite a new user by email', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'newuser@example.com',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.email', 'newuser@example.com')
        ->assertJsonStructure(['data', 'message']);

    $this->assertDatabaseHas('group_invitations', [
        'group_id' => $group->id,
        'email' => 'newuser@example.com',
        'role' => 'member',
    ]);

    Mail::assertQueued(GroupInvitationMail::class, fn ($mail) =>
        $mail->isNewUser === true && $mail->hasTo('newuser@example.com')
    );
});

it('owner can invite an existing user by email', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'existing@example.com',
        ])
        ->assertStatus(201);

    Mail::assertQueued(GroupInvitationMail::class, fn ($mail) =>
        $mail->isNewUser === false && $mail->hasTo('existing@example.com')
    );
});

it('invitation email is stored lowercase', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'User@Example.COM',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.email', 'user@example.com');
});

it('owner can invite with admin role', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'newadmin@example.com',
            'role' => 'admin',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.role', 'admin');

    $this->assertDatabaseHas('group_invitations', [
        'group_id' => $group->id,
        'email' => 'newadmin@example.com',
        'role' => 'admin',
    ]);
});

it('resending an invitation to the same email replaces the previous pending one', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    // First invite
    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", ['email' => 'same@example.com'])
        ->assertStatus(201);

    // Second invite replaces the first
    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", ['email' => 'same@example.com'])
        ->assertStatus(201);

    // Only one pending invitation should exist
    expect(GroupInvitation::where('group_id', $group->id)->where('email', 'same@example.com')->count())->toBe(1);
});

it('prevents inviting a user who is already a member', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $member = User::factory()->create(['email' => 'member@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($member->id, ['role' => 'member']);

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'member@example.com',
        ])
        ->assertStatus(422)
        ->assertJsonPath('message', 'This user is already a member of the group.');

    Mail::assertNothingQueued();
});

it('prevents non-owners from sending invitations', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($member->id, ['role' => 'member']);

    $this->actingAs($member)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'someone@example.com',
        ])
        ->assertStatus(403);

    Mail::assertNothingQueued();
});

it('validates email is required when sending invitation', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

it('validates email format when sending invitation', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'not-an-email',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

it('validates role value when sending invitation', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();

    $this->actingAs($owner)
        ->postJson("/api/v1/groups/{$group->id}/invitations", [
            'email' => 'someone@example.com',
            'role' => 'superadmin',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['role']);
});

// ── List invitations ──────────────────────────────────────────────────────────

it('owner can list pending invitations for a group', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    GroupInvitation::factory()->forGroup($group)->invitedBy($owner)->pending()->count(2)->create();
    // Accepted invitation should not appear
    GroupInvitation::factory()->forGroup($group)->invitedBy($owner)->accepted()->create();
    // Expired invitation should not appear
    GroupInvitation::factory()->forGroup($group)->invitedBy($owner)->expired()->create();

    $this->actingAs($owner)
        ->getJson("/api/v1/groups/{$group->id}/invitations")
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('prevents non-owners from listing invitations', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($member->id, ['role' => 'member']);

    $this->actingAs($member)
        ->getJson("/api/v1/groups/{$group->id}/invitations")
        ->assertStatus(403);
});

// ── Cancel invitation ─────────────────────────────────────────────────────────

it('owner can cancel a pending invitation', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $invitation = GroupInvitation::factory()->forGroup($group)->invitedBy($owner)->pending()->create();

    $this->actingAs($owner)
        ->deleteJson("/api/v1/groups/{$group->id}/invitations/{$invitation->id}")
        ->assertStatus(204);

    $this->assertDatabaseMissing('group_invitations', ['id' => $invitation->id]);
});

it('prevents non-owners from cancelling an invitation', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($member->id, ['role' => 'member']);
    $invitation = GroupInvitation::factory()->forGroup($group)->invitedBy($owner)->pending()->create();

    $this->actingAs($member)
        ->deleteJson("/api/v1/groups/{$group->id}/invitations/{$invitation->id}")
        ->assertStatus(403);
});

it('returns 404 when cancelling an invitation belonging to a different group', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $otherGroup = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $otherGroup->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()->forGroup($otherGroup)->invitedBy($owner)->pending()->create();

    $this->actingAs($owner)
        ->deleteJson("/api/v1/groups/{$group->id}/invitations/{$invitation->id}")
        ->assertStatus(404);
});

// ── Accept invitation ─────────────────────────────────────────────────────────

it('authenticated user can accept a pending invitation matching their email', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'invitee@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('invitee@example.com')
        ->pending()
        ->create();

    $this->actingAs($invitee)
        ->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertOk()
        ->assertJsonPath('message', 'You have joined the group.')
        ->assertJsonPath('group_id', $group->id);

    expect($group->members()->where('user_id', $invitee->id)->exists())->toBeTrue();

    $this->assertDatabaseHas('group_invitations', [
        'id' => $invitation->id,
        'email' => 'invitee@example.com',
    ]);
    expect($invitation->fresh()->isAccepted())->toBeTrue();
});

it('accepted invitation marks accepted_at timestamp', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'invitee@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('invitee@example.com')
        ->pending()
        ->create();

    $this->actingAs($invitee)
        ->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertOk();

    expect($invitation->fresh()->accepted_at)->not->toBeNull();
});

it('invitation assigns correct role when accepted', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'admin@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('admin@example.com')
        ->pending()
        ->create(['role' => 'admin']);

    $this->actingAs($invitee)
        ->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertOk();

    $pivot = $group->members()->where('user_id', $invitee->id)->first();
    expect($pivot->pivot->role)->toBe('admin');
});

it('returns 410 when accepting an expired invitation', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'invitee@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('invitee@example.com')
        ->expired()
        ->create();

    $this->actingAs($invitee)
        ->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertStatus(410)
        ->assertJsonPath('message', 'This invitation has expired.');

    expect($group->members()->where('user_id', $invitee->id)->exists())->toBeFalse();
});

it('returns 403 when accepting an invitation sent to a different email', function () {
    $owner = User::factory()->create();
    $wrongUser = User::factory()->create(['email' => 'wrong@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('intended@example.com')
        ->pending()
        ->create();

    $this->actingAs($wrongUser)
        ->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertStatus(403)
        ->assertJsonPath('message', 'This invitation was sent to a different email address.');
});

it('returns 404 when token does not exist', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/invitations/nonexistent-token/accept')
        ->assertStatus(404);
});

it('returns 404 when invitation is already accepted', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'invitee@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('invitee@example.com')
        ->accepted()
        ->create();

    // Already accepted invitations are not found (whereNull('accepted_at'))
    $this->actingAs($invitee)
        ->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertStatus(404);
});

it('returns 422 when user tries to accept but is already a group member', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'invitee@example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);
    $group->members()->attach($invitee->id, ['role' => 'member']);

    // A pending invitation for this email still exists (e.g. edge-case race)
    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('invitee@example.com')
        ->pending()
        ->create();

    $this->actingAs($invitee)
        ->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertStatus(422)
        ->assertJsonPath('message', 'You are already a member of this group.');
});

it('email comparison is case-insensitive when accepting', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create(['email' => 'User@Example.com']);
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('user@example.com')
        ->pending()
        ->create();

    $this->actingAs($invitee)
        ->postJson("/api/v1/invitations/{$invitation->token}/accept")
        ->assertOk();

    expect($group->members()->where('user_id', $invitee->id)->exists())->toBeTrue();
});
