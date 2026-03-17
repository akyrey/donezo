<?php

declare(strict_types=1);

use App\Models\Heading;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

it('requires authentication to list headings', function () {
    $project = Project::factory()->create();
    $this->getJson("/api/v1/projects/{$project->id}/headings")
        ->assertStatus(401);
});

it('can list headings for a project', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    Heading::factory()->count(3)->for($project)->create();

    $response = $this->actingAs($user)
        ->getJson("/api/v1/projects/{$project->id}/headings")
        ->assertOk();

    $response->assertJsonCount(3, 'data');
});

it('can create a heading', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/v1/projects/{$project->id}/headings", [
            'name' => 'Design Phase',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.name', 'Design Phase');

    $this->assertDatabaseHas('headings', [
        'project_id' => $project->id,
        'name' => 'Design Phase',
    ]);
});

it('auto-increments position on new headings', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    Heading::factory()->for($project)->create(['position' => 0]);
    Heading::factory()->for($project)->create(['position' => 1]);

    $this->actingAs($user)
        ->postJson("/api/v1/projects/{$project->id}/headings", [
            'name' => 'Third heading',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.position', 2);
});

it('can show a heading', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $heading = Heading::factory()->for($project)->create(['name' => 'Test Heading']);

    $this->actingAs($user)
        ->getJson("/api/v1/headings/{$heading->id}")
        ->assertOk()
        ->assertJsonPath('data.name', 'Test Heading');
});

it('can update a heading', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $heading = Heading::factory()->for($project)->create();

    $this->actingAs($user)
        ->putJson("/api/v1/headings/{$heading->id}", [
            'name' => 'Updated Heading',
        ])
        ->assertOk()
        ->assertJsonPath('data.name', 'Updated Heading');

    $this->assertDatabaseHas('headings', [
        'id' => $heading->id,
        'name' => 'Updated Heading',
    ]);
});

it('can delete a heading and nullifies task heading_id', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $heading = Heading::factory()->for($project)->create();
    $task = Task::factory()->for($user)->forHeading($heading)->create();

    $this->actingAs($user)
        ->deleteJson("/api/v1/headings/{$heading->id}")
        ->assertStatus(204);

    $this->assertDatabaseMissing('headings', ['id' => $heading->id]);

    // Task should have heading_id set to null
    expect($task->fresh()->heading_id)->toBeNull();
});

it('can reorder headings', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $h1 = Heading::factory()->for($project)->create(['position' => 0]);
    $h2 = Heading::factory()->for($project)->create(['position' => 1]);
    $h3 = Heading::factory()->for($project)->create(['position' => 2]);

    $this->actingAs($user)
        ->postJson('/api/v1/headings/reorder', [
            'headings' => [
                ['id' => $h3->id, 'position' => 0],
                ['id' => $h1->id, 'position' => 1],
                ['id' => $h2->id, 'position' => 2],
            ],
        ])
        ->assertOk();

    expect($h3->fresh()->position)->toBe(0);
    expect($h1->fresh()->position)->toBe(1);
    expect($h2->fresh()->position)->toBe(2);
});

it('prevents access to other users headings', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $project = Project::factory()->for($otherUser)->create();
    $heading = Heading::factory()->for($project)->create();

    $this->actingAs($user)
        ->getJson("/api/v1/projects/{$project->id}/headings")
        ->assertStatus(403);

    $this->actingAs($user)
        ->getJson("/api/v1/headings/{$heading->id}")
        ->assertStatus(403);

    $this->actingAs($user)
        ->putJson("/api/v1/headings/{$heading->id}", ['name' => 'Hacked'])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/v1/headings/{$heading->id}")
        ->assertStatus(403);
});

it('cannot reorder headings belonging to other users', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $project = Project::factory()->for($otherUser)->create();
    $heading = Heading::factory()->for($project)->create(['position' => 0]);

    $this->actingAs($user)
        ->postJson('/api/v1/headings/reorder', [
            'headings' => [
                ['id' => $heading->id, 'position' => 5],
            ],
        ])
        ->assertOk();

    // Position should not have changed because the query scopes by user_id
    expect($heading->fresh()->position)->toBe(0);
});

it('validates name is required when creating a heading', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/v1/projects/{$project->id}/headings", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});
