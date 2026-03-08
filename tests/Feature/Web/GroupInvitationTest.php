<?php

use App\Models\Group;
use App\Models\GroupInvitation;
use App\Models\User;

// ── Accept-invitation page (GET /invitations/{token}) ─────────────────────────

it('requires authentication to view the accept invitation page', function () {
    $invitation = GroupInvitation::factory()->pending()->create();

    $this->get("/invitations/{$invitation->token}")
        ->assertRedirect('/login');
});

it('renders the accept invitation page for a valid pending invitation', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->pending()
        ->create();

    $this->actingAs($invitee)
        ->get("/invitations/{$invitation->token}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Groups/AcceptInvitation')
            ->has('invitation')
            ->where('invitation.token', $invitation->token)
            ->where('invitation.email', $invitation->email)
            ->where('invitation.expired', false)
            ->where('invitation.group.id', $group->id)
            ->where('invitation.group.name', $group->name)
            ->where('invitation.inviter.name', $owner->name)
        );
});

it('renders the accept invitation page with expired flag for an expired invitation', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->expired()
        ->create();

    $this->actingAs($invitee)
        ->get("/invitations/{$invitation->token}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Groups/AcceptInvitation')
            ->where('invitation.expired', true)
        );
});

it('returns 404 for a non-existent invitation token', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/invitations/totally-fake-token')
        ->assertStatus(404);
});

it('returns 404 for an already accepted invitation', function () {
    $owner = User::factory()->create();
    $invitee = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->accepted()
        ->create();

    $this->actingAs($invitee)
        ->get("/invitations/{$invitation->token}")
        ->assertStatus(404);
});
