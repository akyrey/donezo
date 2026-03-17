<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\User;

it('requires authentication', function () {
    $this->getJson('/api/v1/projects')->assertStatus(401);
});

it('can list projects', function () {
    $user = User::factory()->create();
    Project::factory()->count(3)->for($user)->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/projects');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});

it('can create a project', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/projects', [
            'name' => 'My Project',
            'description' => 'Project description',
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.name', 'My Project');

    $this->assertDatabaseHas('projects', [
        'user_id' => $user->id,
        'name' => 'My Project',
        'status' => 'active',
    ]);
});

it('can update a project', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create(['name' => 'Old name']);

    $response = $this->actingAs($user)
        ->putJson("/api/v1/projects/{$project->id}", [
            'name' => 'Updated name',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Updated name');

    $this->assertDatabaseHas('projects', [
        'id' => $project->id,
        'name' => 'Updated name',
    ]);
});

it('can delete a project', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/projects/{$project->id}");

    $response->assertStatus(204);
    $this->assertSoftDeleted('projects', ['id' => $project->id]);
});

it('cannot access other users projects', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $project = Project::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->getJson("/api/v1/projects/{$project->id}")
        ->assertStatus(403);

    $this->actingAs($user)
        ->putJson("/api/v1/projects/{$project->id}", ['name' => 'Hijacked'])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/v1/projects/{$project->id}")
        ->assertStatus(403);
});

it('only lists own projects', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Project::factory()->for($user)->count(2)->create();
    Project::factory()->for($otherUser)->count(3)->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/projects');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('validates project creation data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/projects', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('name');
});
