<?php

declare(strict_types=1);

use App\Models\Task;
use App\Models\User;

it('requires authentication', function () {
    $response = $this->get('/inbox');

    $response->assertRedirect('/login');
});

it('can render inbox page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/inbox');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('Inbox'));
});

it('shows inbox tasks', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->inbox()->count(3)->create();
    // These should not appear in the inbox
    Task::factory()->for($user)->today()->create();
    Task::factory()->for($user)->completed()->create();

    $response = $this->actingAs($user)->get('/inbox');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Inbox')
        ->has('tasks', 3)
    );
});

it('does not show other users inbox tasks', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Task::factory()->for($user)->inbox()->count(2)->create();
    Task::factory()->for($otherUser)->inbox()->count(3)->create();

    $response = $this->actingAs($user)->get('/inbox');

    $response->assertInertia(fn ($page) => $page
        ->component('Inbox')
        ->has('tasks', 2)
    );
});
