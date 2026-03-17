<?php

declare(strict_types=1);

use App\Models\PushSubscription;
use App\Models\User;

it('requires authentication to store push subscription', function () {
    $this->postJson('/api/v1/push-subscriptions', [
        'endpoint' => 'https://example.com/push/123',
        'keys' => ['p256dh' => 'key1', 'auth' => 'key2'],
    ])->assertStatus(401);
});

it('can store a push subscription', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/push-subscriptions', [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/abc123',
            'keys' => [
                'p256dh' => 'BNcRdreALRFXTkOOUH...',
                'auth' => 'tBHItQ...',
            ],
            'content_encoding' => 'aesgcm',
        ])
        ->assertStatus(201)
        ->assertJsonStructure(['data' => ['id', 'endpoint']]);

    $this->assertDatabaseHas('push_subscriptions', [
        'user_id' => $user->id,
        'endpoint' => 'https://fcm.googleapis.com/fcm/send/abc123',
    ]);
});

it('updates existing subscription on same endpoint', function () {
    $user = User::factory()->create();
    $endpoint = 'https://fcm.googleapis.com/fcm/send/existing';
    PushSubscription::factory()->forUser($user)->create([
        'endpoint' => $endpoint,
        'p256dh_key' => 'old_key',
    ]);

    $this->actingAs($user)
        ->postJson('/api/v1/push-subscriptions', [
            'endpoint' => $endpoint,
            'keys' => [
                'p256dh' => 'new_key',
                'auth' => 'new_auth',
            ],
        ])
        ->assertStatus(201);

    expect(PushSubscription::where('endpoint', $endpoint)->count())->toBe(1);
    expect(PushSubscription::where('endpoint', $endpoint)->first()->p256dh_key)->toBe('new_key');
});

it('can delete a push subscription', function () {
    $user = User::factory()->create();
    $endpoint = 'https://fcm.googleapis.com/fcm/send/to-delete';
    PushSubscription::factory()->forUser($user)->create(['endpoint' => $endpoint]);

    $this->actingAs($user)
        ->deleteJson('/api/v1/push-subscriptions', [
            'endpoint' => $endpoint,
        ])
        ->assertStatus(204);

    $this->assertDatabaseMissing('push_subscriptions', ['endpoint' => $endpoint]);
});

it('does not delete other users subscriptions', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $endpoint = 'https://fcm.googleapis.com/fcm/send/other';
    PushSubscription::factory()->forUser($otherUser)->create(['endpoint' => $endpoint]);

    $this->actingAs($user)
        ->deleteJson('/api/v1/push-subscriptions', [
            'endpoint' => $endpoint,
        ])
        ->assertStatus(204);

    // Other user's subscription should still exist
    $this->assertDatabaseHas('push_subscriptions', ['endpoint' => $endpoint]);
});

it('can retrieve vapid public key', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/push-subscriptions/vapid-key')
        ->assertOk()
        ->assertJsonStructure(['public_key']);
});

it('validates required fields when storing subscription', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/push-subscriptions', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['endpoint', 'keys.p256dh', 'keys.auth']);
});
