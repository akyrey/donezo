<?php

use App\Models\SocialAccount;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

it('requires authentication to check calendar status', function () {
    $this->getJson('/api/v1/calendar/status')
        ->assertStatus(401);
});

it('returns disconnected status when no google account', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/calendar/status')
        ->assertOk()
        ->assertJsonPath('connected', false)
        ->assertJsonPath('has_calendar_scope', false);
});

it('returns connected status with calendar scope', function () {
    $user = User::factory()->create();
    SocialAccount::factory()->forUser($user)->withCalendarAccess()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/calendar/status')
        ->assertOk()
        ->assertJsonPath('connected', true)
        ->assertJsonPath('has_calendar_scope', true);
});

it('reports token expired status', function () {
    $user = User::factory()->create();
    SocialAccount::factory()->forUser($user)->withCalendarAccess()->expired()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/calendar/status')
        ->assertOk()
        ->assertJsonPath('connected', true)
        ->assertJsonPath('token_expired', true);
});

it('can disconnect calendar', function () {
    $user = User::factory()->create();
    SocialAccount::factory()->forUser($user)->withCalendarAccess()->create();
    $task = Task::factory()->for($user)->create(['google_calendar_event_id' => 'evt_123']);

    $this->actingAs($user)
        ->postJson('/api/v1/calendar/disconnect')
        ->assertOk();

    // Calendar event IDs should be cleared
    expect($task->fresh()->google_calendar_event_id)->toBeNull();

    // Calendar scope should be removed
    $account = $user->socialAccounts()->where('provider', 'google')->first();
    expect($account->hasCalendarAccess())->toBeFalse();
});

it('can trigger calendar sync', function () {
    Queue::fake();

    $user = User::factory()->create();
    SocialAccount::factory()->forUser($user)->withCalendarAccess()->create();
    Task::factory()->for($user)->create([
        'scheduled_at' => now()->addDay(),
        'completed_at' => null,
        'cancelled_at' => null,
    ]);
    Task::factory()->for($user)->create([
        'deadline_at' => now()->addWeek(),
        'completed_at' => null,
        'cancelled_at' => null,
    ]);
    // Task without dates should not be synced
    Task::factory()->for($user)->create([
        'scheduled_at' => null,
        'deadline_at' => null,
        'completed_at' => null,
        'cancelled_at' => null,
    ]);

    $this->actingAs($user)
        ->postJson('/api/v1/calendar/sync')
        ->assertOk()
        ->assertJsonPath('count', 2);
});

it('returns error when syncing without calendar connected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/calendar/sync')
        ->assertStatus(422);
});

it('returns error when syncing without calendar scope', function () {
    $user = User::factory()->create();
    SocialAccount::factory()->forUser($user)->create(['scopes' => []]);

    $this->actingAs($user)
        ->postJson('/api/v1/calendar/sync')
        ->assertStatus(422);
});
