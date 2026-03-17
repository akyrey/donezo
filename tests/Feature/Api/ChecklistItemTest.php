<?php

declare(strict_types=1);

use App\Models\ChecklistItem;
use App\Models\Task;
use App\Models\User;

it('requires authentication to list checklist items', function () {
    $task = Task::factory()->create();
    $this->getJson("/api/v1/tasks/{$task->id}/checklist-items")
        ->assertStatus(401);
});

it('can list checklist items for a task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    ChecklistItem::factory()->count(3)->forTask($task)->create();

    $response = $this->actingAs($user)
        ->getJson("/api/v1/tasks/{$task->id}/checklist-items")
        ->assertOk();

    $response->assertJsonCount(3, 'data');
});

it('can create a checklist item', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/v1/tasks/{$task->id}/checklist-items", [
            'title' => 'Buy groceries',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.title', 'Buy groceries')
        ->assertJsonPath('data.is_completed', false);

    $this->assertDatabaseHas('checklist_items', [
        'task_id' => $task->id,
        'title' => 'Buy groceries',
    ]);
});

it('auto-increments position on new checklist items', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    ChecklistItem::factory()->forTask($task)->create(['position' => 0]);
    ChecklistItem::factory()->forTask($task)->create(['position' => 1]);

    $this->actingAs($user)
        ->postJson("/api/v1/tasks/{$task->id}/checklist-items", [
            'title' => 'Third item',
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.position', 2);
});

it('can show a checklist item', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $item = ChecklistItem::factory()->forTask($task)->create(['title' => 'Test item']);

    $this->actingAs($user)
        ->getJson("/api/v1/checklist-items/{$item->id}")
        ->assertOk()
        ->assertJsonPath('data.title', 'Test item');
});

it('can update a checklist item', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $item = ChecklistItem::factory()->forTask($task)->create();

    $this->actingAs($user)
        ->putJson("/api/v1/checklist-items/{$item->id}", [
            'title' => 'Updated title',
        ])
        ->assertOk()
        ->assertJsonPath('data.title', 'Updated title');

    $this->assertDatabaseHas('checklist_items', [
        'id' => $item->id,
        'title' => 'Updated title',
    ]);
});

it('can delete a checklist item', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $item = ChecklistItem::factory()->forTask($task)->create();

    $this->actingAs($user)
        ->deleteJson("/api/v1/checklist-items/{$item->id}")
        ->assertStatus(204);

    $this->assertDatabaseMissing('checklist_items', ['id' => $item->id]);
});

it('can toggle a checklist item', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();
    $item = ChecklistItem::factory()->forTask($task)->create(['is_completed' => false]);

    $this->actingAs($user)
        ->postJson("/api/v1/checklist-items/{$item->id}/toggle")
        ->assertOk()
        ->assertJsonPath('data.is_completed', true);

    // Toggle back
    $this->actingAs($user)
        ->postJson("/api/v1/checklist-items/{$item->id}/toggle")
        ->assertOk()
        ->assertJsonPath('data.is_completed', false);
});

it('prevents access to other users checklist items', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $task = Task::factory()->for($otherUser)->create();
    $item = ChecklistItem::factory()->forTask($task)->create();

    $this->actingAs($user)
        ->getJson("/api/v1/tasks/{$task->id}/checklist-items")
        ->assertStatus(403);

    $this->actingAs($user)
        ->getJson("/api/v1/checklist-items/{$item->id}")
        ->assertStatus(403);

    $this->actingAs($user)
        ->putJson("/api/v1/checklist-items/{$item->id}", ['title' => 'Hacked'])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/v1/checklist-items/{$item->id}")
        ->assertStatus(403);

    $this->actingAs($user)
        ->postJson("/api/v1/checklist-items/{$item->id}/toggle")
        ->assertStatus(403);
});

it('validates title is required when creating a checklist item', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/v1/tasks/{$task->id}/checklist-items", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['title']);
});
