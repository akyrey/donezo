<?php

declare(strict_types=1);

use App\Models\Tag;
use App\Models\User;

it('requires authentication', function () {
    $this->getJson('/api/v1/tags')->assertStatus(401);
});

it('can list tags', function () {
    $user = User::factory()->create();
    Tag::factory()->count(3)->for($user)->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/tags');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

it('can create a tag', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/tags', [
            'name' => 'urgent',
            'color' => '#ff0000',
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.name', 'urgent');

    $this->assertDatabaseHas('tags', [
        'user_id' => $user->id,
        'name' => 'urgent',
        'color' => '#ff0000',
    ]);
});

it('can update a tag', function () {
    $user = User::factory()->create();
    $tag = Tag::factory()->for($user)->create(['name' => 'old-tag']);

    $response = $this->actingAs($user)
        ->putJson("/api/v1/tags/{$tag->id}", [
            'name' => 'updated-tag',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'updated-tag');
});

it('can delete a tag', function () {
    $user = User::factory()->create();
    $tag = Tag::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/tags/{$tag->id}");

    $response->assertStatus(204);
    $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
});

it('cannot access other users tags', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $tag = Tag::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->getJson("/api/v1/tags/{$tag->id}")
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/v1/tags/{$tag->id}")
        ->assertStatus(403);
});

it('validates tag creation data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/tags', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('name');
});
