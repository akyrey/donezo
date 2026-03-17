<?php

declare(strict_types=1);

use App\Models\Section;
use App\Models\User;

it('requires authentication', function () {
    $this->getJson('/api/v1/sections')->assertStatus(401);
});

it('can list sections', function () {
    $user = User::factory()->create();
    Section::factory()->count(3)->for($user)->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/sections');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

it('can create a section', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/sections', [
            'name' => 'Work',
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.name', 'Work');

    $this->assertDatabaseHas('sections', [
        'user_id' => $user->id,
        'name' => 'Work',
    ]);
});

it('can update a section', function () {
    $user = User::factory()->create();
    $section = Section::factory()->for($user)->create(['name' => 'Old name']);

    $response = $this->actingAs($user)
        ->putJson("/api/v1/sections/{$section->id}", [
            'name' => 'Updated name',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Updated name');

    $this->assertDatabaseHas('sections', [
        'id' => $section->id,
        'name' => 'Updated name',
    ]);
});

it('can delete a section', function () {
    $user = User::factory()->create();
    $section = Section::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/sections/{$section->id}");

    $response->assertStatus(204);
    $this->assertSoftDeleted('sections', ['id' => $section->id]);
});

it('cannot access other users sections', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $section = Section::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->getJson("/api/v1/sections/{$section->id}")
        ->assertStatus(403);

    $this->actingAs($user)
        ->putJson("/api/v1/sections/{$section->id}", ['name' => 'Hijacked'])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/v1/sections/{$section->id}")
        ->assertStatus(403);
});

it('validates section creation data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/sections', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('name');
});
