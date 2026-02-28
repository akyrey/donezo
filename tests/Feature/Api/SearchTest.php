<?php

use App\Models\Project;
use App\Models\Section;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;

it('requires authentication to search', function () {
    $this->getJson('/api/v1/search?q=test')
        ->assertStatus(401);
});

it('can search tasks by title', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create(['title' => 'Buy groceries at the store']);
    Task::factory()->for($user)->create(['title' => 'Clean the house']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=groceries')
        ->assertOk();

    $response->assertJsonCount(1, 'tasks');
    $response->assertJsonPath('tasks.0.title', 'Buy groceries at the store');
});

it('can search tasks by description', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create([
        'title' => 'Important task',
        'description' => 'Need to call the dentist tomorrow',
    ]);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=dentist')
        ->assertOk();

    $response->assertJsonCount(1, 'tasks');
});

it('can search projects by name', function () {
    $user = User::factory()->create();
    Project::factory()->for($user)->create(['name' => 'Website Redesign']);
    Project::factory()->for($user)->create(['name' => 'Mobile App']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=website')
        ->assertOk();

    $response->assertJsonCount(1, 'projects');
    $response->assertJsonPath('projects.0.name', 'Website Redesign');
});

it('can search sections by name', function () {
    $user = User::factory()->create();
    Section::factory()->forUser($user)->create(['name' => 'Personal']);
    Section::factory()->forUser($user)->create(['name' => 'Work']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=personal')
        ->assertOk();

    $response->assertJsonCount(1, 'sections');
});

it('can search tags by name', function () {
    $user = User::factory()->create();
    Tag::factory()->forUser($user)->create(['name' => 'urgent']);
    Tag::factory()->forUser($user)->create(['name' => 'low-priority']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=urgent')
        ->assertOk();

    $response->assertJsonCount(1, 'tags');
});

it('excludes cancelled tasks from search', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->create(['title' => 'Active searchable task']);
    Task::factory()->for($user)->cancelled()->create(['title' => 'Cancelled searchable task']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=searchable')
        ->assertOk();

    $response->assertJsonCount(1, 'tasks');
    $response->assertJsonPath('tasks.0.title', 'Active searchable task');
});

it('excludes archived projects from search', function () {
    $user = User::factory()->create();
    Project::factory()->for($user)->create(['name' => 'Active Project Foo']);
    Project::factory()->for($user)->create(['name' => 'Archived Project Foo', 'status' => 'archived']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=foo')
        ->assertOk();

    $response->assertJsonCount(1, 'projects');
});

it('does not return other users data', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Task::factory()->for($otherUser)->create(['title' => 'Secret task']);
    Project::factory()->for($otherUser)->create(['name' => 'Secret project']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=secret')
        ->assertOk();

    $response->assertJsonCount(0, 'tasks');
    $response->assertJsonCount(0, 'projects');
});

it('validates query parameter is required', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/v1/search')
        ->assertStatus(422)
        ->assertJsonValidationErrors(['q']);
});

it('returns all entity types in response', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=anything')
        ->assertOk();

    $response->assertJsonStructure(['tasks', 'projects', 'sections', 'tags']);
});

it('respects the limit parameter', function () {
    $user = User::factory()->create();
    Task::factory()->count(15)->for($user)->create(['title' => 'Searchable task']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/search?q=searchable&limit=5')
        ->assertOk();

    $response->assertJsonCount(5, 'tasks');
});
