<?php

declare(strict_types=1);

use App\Models\Reminder;
use App\Models\Task;
use App\Models\User;

it('requires authentication to list reminders', function () {
    $task = Task::factory()->create();
    $this->getJson("/api/v1/tasks/{$task->id}/reminders")
        ->assertStatus(401);
});

it('can list reminders for a task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    Reminder::factory()->count(2)->forTask($task)->create();

    $response = $this->actingAs($user)
        ->getJson("/api/v1/tasks/{$task->id}/reminders")
        ->assertOk();

    $response->assertJsonCount(2, 'data');
});

it('can create a reminder', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $remindAt = now()->addDay()->toIso8601String();

    $this->actingAs($user)
        ->postJson("/api/v1/tasks/{$task->id}/reminders", [
            'remind_at' => $remindAt,
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.is_sent', false);

    $this->assertDatabaseHas('reminders', [
        'task_id' => $task->id,
    ]);
});

it('can show a reminder', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $reminder = Reminder::factory()->forTask($task)->create();

    $this->actingAs($user)
        ->getJson("/api/v1/reminders/{$reminder->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $reminder->id);
});

it('can update a reminder', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $reminder = Reminder::factory()->forTask($task)->create();
    $newDate = now()->addWeek()->toIso8601String();

    $this->actingAs($user)
        ->putJson("/api/v1/reminders/{$reminder->id}", [
            'remind_at' => $newDate,
        ])
        ->assertOk();
});

it('can delete a reminder', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $reminder = Reminder::factory()->forTask($task)->create();

    $this->actingAs($user)
        ->deleteJson("/api/v1/reminders/{$reminder->id}")
        ->assertStatus(204);

    $this->assertDatabaseMissing('reminders', ['id' => $reminder->id]);
});

it('prevents access to other users reminders', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $task = Task::factory()->for($otherUser)->create();
    $reminder = Reminder::factory()->forTask($task)->create();

    $this->actingAs($user)
        ->getJson("/api/v1/tasks/{$task->id}/reminders")
        ->assertStatus(403);

    $this->actingAs($user)
        ->getJson("/api/v1/reminders/{$reminder->id}")
        ->assertStatus(403);

    $this->actingAs($user)
        ->putJson("/api/v1/reminders/{$reminder->id}", ['remind_at' => now()->addDay()->toIso8601String()])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/v1/reminders/{$reminder->id}")
        ->assertStatus(403);
});

it('validates remind_at is required and must be in the future', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    // Missing remind_at
    $this->actingAs($user)
        ->postJson("/api/v1/tasks/{$task->id}/reminders", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['remind_at']);

    // Past date
    $this->actingAs($user)
        ->postJson("/api/v1/tasks/{$task->id}/reminders", [
            'remind_at' => now()->subDay()->toIso8601String(),
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['remind_at']);
});
