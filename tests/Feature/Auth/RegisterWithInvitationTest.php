<?php

declare(strict_types=1);

use App\Models\Group;
use App\Models\GroupInvitation;
use App\Models\User;

// ── Register page with invitation token ───────────────────────────────────────

it('renders register page with invitation data when token is valid', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('newbie@example.com')
        ->pending()
        ->create();

    $this->get("/register?invitation={$invitation->token}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Auth/Register')
            ->where('invitationToken', $invitation->token)
            ->where('invitationEmail', 'newbie@example.com')
        );
});

it('renders register page without invitation data when token is invalid', function () {
    $this->get('/register?invitation=bogus-token')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Auth/Register')
            ->where('invitationToken', 'bogus-token')
            ->where('invitationEmail', null)
        );
});

it('renders register page without invitation data when token is expired', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->expired()
        ->create();

    $this->get("/register?invitation={$invitation->token}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Auth/Register')
            ->where('invitationEmail', null)
        );
});

// ── Auto-accept invitation on registration ────────────────────────────────────

it('auto-accepts a pending invitation when registering with a matching token', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('newbie@example.com')
        ->pending()
        ->create();

    $response = $this->post('/register', [
        'name' => 'New User',
        'email' => 'newbie@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'password123!',
        'invitation_token' => $invitation->token,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.notice'));

    $newUser = User::where('email', 'newbie@example.com')->first();
    expect($group->members()->where('user_id', $newUser->id)->exists())->toBeTrue();
    expect($invitation->fresh()->isAccepted())->toBeTrue();
});

it('assigns the correct role when auto-accepting on registration', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('newadmin@example.com')
        ->pending()
        ->create(['role' => 'admin']);

    $this->post('/register', [
        'name' => 'New Admin',
        'email' => 'newadmin@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'password123!',
        'invitation_token' => $invitation->token,
    ]);

    $newUser = User::where('email', 'newadmin@example.com')->first();
    $pivot = $group->members()->where('user_id', $newUser->id)->first();
    expect($pivot->pivot->role)->toBe('admin');
});

it('redirects to verification notice when registering without an invitation token', function () {
    $response = $this->post('/register', [
        'name' => 'Plain User',
        'email' => 'plain@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'password123!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.notice'));
});

it('redirects to verification notice when registering with a bogus invitation token', function () {
    $response = $this->post('/register', [
        'name' => 'Tricky User',
        'email' => 'tricky@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'password123!',
        'invitation_token' => 'does-not-exist',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.notice'));
});

it('does not auto-accept when email does not match invitation', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('intended@example.com')
        ->pending()
        ->create();

    $response = $this->post('/register', [
        'name' => 'Wrong User',
        'email' => 'different@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'password123!',
        'invitation_token' => $invitation->token,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.notice'));

    $wrongUser = User::where('email', 'different@example.com')->first();
    expect($group->members()->where('user_id', $wrongUser->id)->exists())->toBeFalse();
    expect($invitation->fresh()->isAccepted())->toBeFalse();
});

it('does not auto-accept an expired invitation on registration', function () {
    $owner = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $invitation = GroupInvitation::factory()
        ->forGroup($group)
        ->invitedBy($owner)
        ->forEmail('late@example.com')
        ->expired()
        ->create();

    $response = $this->post('/register', [
        'name' => 'Late User',
        'email' => 'late@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'password123!',
        'invitation_token' => $invitation->token,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.notice'));

    $lateUser = User::where('email', 'late@example.com')->first();
    expect($group->members()->where('user_id', $lateUser->id)->exists())->toBeFalse();
});
