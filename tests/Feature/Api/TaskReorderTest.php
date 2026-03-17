<?php

declare(strict_types=1);

use App\Models\Task;
use App\Models\User;

it('can reorder tasks', function () {
    $user = User::factory()->create();
    $t1 = Task::factory()->for($user)->create(['position' => 0]);
    $t2 = Task::factory()->for($user)->create(['position' => 1]);
    $t3 = Task::factory()->for($user)->create(['position' => 2]);

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/reorder', [
            'tasks' => [
                ['id' => $t3->id, 'position' => 0],
                ['id' => $t1->id, 'position' => 1],
                ['id' => $t2->id, 'position' => 2],
            ],
        ])
        ->assertOk();

    expect($t3->fresh()->position)->toBe(0);
    expect($t1->fresh()->position)->toBe(1);
    expect($t2->fresh()->position)->toBe(2);
});

it('cannot reorder tasks belonging to other users', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $task = Task::factory()->for($otherUser)->create(['position' => 0]);

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/reorder', [
            'tasks' => [
                ['id' => $task->id, 'position' => 5],
            ],
        ])
        ->assertOk();

    // Position should remain unchanged because of user_id scoping
    expect($task->fresh()->position)->toBe(0);
});

it('validates reorder request structure', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/reorder', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['tasks']);

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/reorder', [
            'tasks' => [
                ['id' => 'not-a-number', 'position' => 'abc'],
            ],
        ])
        ->assertStatus(422);
});

it('requires authentication for reorder', function () {
    $this->postJson('/api/v1/tasks/reorder', [
        'tasks' => [],
    ])->assertStatus(401);
});
