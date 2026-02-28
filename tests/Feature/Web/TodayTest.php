<?php

use App\Models\Task;
use App\Models\User;

it('requires authentication', function () {
    $response = $this->get('/today');

    $response->assertRedirect('/login');
});

it('can render today page', function () {
    $user = User::factory()->create(['timezone' => 'UTC']);

    $response = $this->actingAs($user)->get('/today');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('Today'));
});

it('shows today tasks', function () {
    $user = User::factory()->create(['timezone' => 'UTC']);
    Task::factory()->for($user)->today()->count(2)->create(['is_evening' => false]);
    // Inbox tasks should not appear on the today page
    Task::factory()->for($user)->inbox()->create();

    $response = $this->actingAs($user)->get('/today');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Today')
        ->has('tasks', 2)
    );
});

it('separates evening tasks', function () {
    $user = User::factory()->create(['timezone' => 'UTC']);
    Task::factory()->for($user)->today()->create(['is_evening' => false]);
    Task::factory()->for($user)->today()->evening()->create();

    $response = $this->actingAs($user)->get('/today');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Today')
        ->has('tasks', 1)
        ->has('eveningTasks', 1)
    );
});

it('does not show completed tasks', function () {
    $user = User::factory()->create(['timezone' => 'UTC']);
    Task::factory()->for($user)->today()->create(['is_evening' => false]);
    Task::factory()->for($user)->completed()->create();

    $response = $this->actingAs($user)->get('/today');

    $response->assertInertia(fn ($page) => $page
        ->component('Today')
        ->has('tasks', 1)
    );
});
