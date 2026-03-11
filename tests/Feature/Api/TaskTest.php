<?php

use App\Models\Heading;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

it('requires authentication', function () {
    $this->getJson('/api/v1/tasks')->assertStatus(401);
    $this->postJson('/api/v1/tasks')->assertStatus(401);
});

it('can list user tasks', function () {
    $user = User::factory()->create();
    Task::factory()->count(3)->for($user)->inbox()->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/tasks');

    $response->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [['id', 'title', 'status']],
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ]);
});

it('can create a task', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/tasks', [
            'title' => 'Buy groceries',
            'status' => 'inbox',
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.title', 'Buy groceries')
        ->assertJsonPath('data.status', 'inbox');

    $this->assertDatabaseHas('tasks', [
        'user_id' => $user->id,
        'title' => 'Buy groceries',
        'status' => 'inbox',
    ]);
});

it('can update a task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->inbox()->create(['title' => 'Old title']);

    $response = $this->actingAs($user)
        ->putJson("/api/v1/tasks/{$task->id}", [
            'title' => 'Updated title',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.title', 'Updated title');

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'Updated title',
    ]);
});

it('can complete a task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->inbox()->create();

    $response = $this->actingAs($user)
        ->postJson("/api/v1/tasks/{$task->id}/complete");

    $response->assertOk()
        ->assertJsonPath('data.status', 'completed');

    $task->refresh();
    expect($task->status)->toBe('completed')
        ->and($task->completed_at)->not->toBeNull();
});

it('can uncomplete a task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->completed()->create();

    $response = $this->actingAs($user)
        ->postJson("/api/v1/tasks/{$task->id}/uncomplete");

    $response->assertOk()
        ->assertJsonPath('data.status', 'inbox');

    $task->refresh();
    expect($task->status)->toBe('inbox')
        ->and($task->completed_at)->toBeNull();
});

it('can delete a task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->for($user)->inbox()->create();

    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/tasks/{$task->id}");

    $response->assertStatus(204);
    $this->assertSoftDeleted('tasks', ['id' => $task->id]);
});

it('cannot access other users tasks', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $task = Task::factory()->for($otherUser)->create();

    $this->actingAs($user)
        ->getJson("/api/v1/tasks/{$task->id}")
        ->assertStatus(403);

    $this->actingAs($user)
        ->putJson("/api/v1/tasks/{$task->id}", ['title' => 'Hijacked'])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/v1/tasks/{$task->id}")
        ->assertStatus(403);
});

it('can filter tasks by status', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->inbox()->create();
    Task::factory()->for($user)->today()->create();
    Task::factory()->for($user)->create(['status' => 'anytime']);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/tasks?status=inbox');

    $response->assertOk()
        ->assertJsonCount(1, 'data');

    $response = $this->actingAs($user)
        ->getJson('/api/v1/tasks?status=today');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

it('validates task creation data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/tasks', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('title');
});

it('does not list completed or cancelled tasks by default', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->inbox()->create();
    Task::factory()->for($user)->completed()->create();
    Task::factory()->for($user)->cancelled()->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/tasks');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

it('only lists own tasks', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Task::factory()->for($user)->inbox()->count(2)->create();
    Task::factory()->for($otherUser)->inbox()->count(3)->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/tasks');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('can reorder tasks', function () {
    $user = User::factory()->create();
    $t1 = Task::factory()->for($user)->inbox()->create(['position' => 0]);
    $t2 = Task::factory()->for($user)->inbox()->create(['position' => 1]);
    $t3 = Task::factory()->for($user)->inbox()->create(['position' => 2]);

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/reorder', [
            'tasks' => [
                ['id' => $t3->id, 'position' => 0],
                ['id' => $t1->id, 'position' => 1],
                ['id' => $t2->id, 'position' => 2],
            ],
        ])
        ->assertOk()
        ->assertJsonPath('message', 'Tasks reordered successfully.');

    expect($t3->fresh()->position)->toBe(0);
    expect($t1->fresh()->position)->toBe(1);
    expect($t2->fresh()->position)->toBe(2);
});

it('can reorder tasks and change heading_id', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $heading = Heading::factory()->for($project)->create();

    $t1 = Task::factory()->for($user)->inbox()->create(['position' => 0, 'heading_id' => null]);
    $t2 = Task::factory()->for($user)->inbox()->create(['position' => 1, 'heading_id' => null]);

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/reorder', [
            'tasks' => [
                ['id' => $t1->id, 'position' => 0, 'heading_id' => $heading->id],
                ['id' => $t2->id, 'position' => 1, 'heading_id' => $heading->id],
            ],
        ])
        ->assertOk();

    expect($t1->fresh()->heading_id)->toBe($heading->id);
    expect($t2->fresh()->heading_id)->toBe($heading->id);
    expect($t1->fresh()->position)->toBe(0);
    expect($t2->fresh()->position)->toBe(1);
});

it('can move a task to unassigned by setting heading_id to null', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();
    $heading = Heading::factory()->for($project)->create();

    $task = Task::factory()->for($user)->inbox()->create([
        'position' => 0,
        'heading_id' => $heading->id,
    ]);

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/reorder', [
            'tasks' => [
                ['id' => $task->id, 'position' => 0, 'heading_id' => null],
            ],
        ])
        ->assertOk();

    expect($task->fresh()->heading_id)->toBeNull();
});

it('cannot reorder tasks belonging to other users', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $task = Task::factory()->for($other)->inbox()->create(['position' => 0]);

    $this->actingAs($user)
        ->postJson('/api/v1/tasks/reorder', [
            'tasks' => [
                ['id' => $task->id, 'position' => 5],
            ],
        ])
        ->assertOk(); // returns 200 but position is unchanged

    expect($task->fresh()->position)->toBe(0);
});
