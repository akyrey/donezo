<?php

use App\Models\Group;
use App\Models\Section;
use App\Models\Task;
use App\Models\User;

it('requires authentication for settings page', function () {
    $this->get('/settings')
        ->assertRedirect('/login');
});

it('renders the settings page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/settings')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Settings/Index')
            ->has('calendarStatus')
            ->has('hasGoogleAccount')
            ->has('hasPushSubscriptions')
        );
});

it('requires authentication for upcoming page', function () {
    $this->get('/upcoming')
        ->assertRedirect('/login');
});

it('renders the upcoming page with grouped tasks', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->upcoming()->create();

    $this->actingAs($user)
        ->get('/upcoming')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Upcoming')
            ->has('grouped_tasks')
        );
});

it('excludes completed tasks from upcoming', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->upcoming()->create([
        'scheduled_at' => now()->addDays(2),
    ]);
    Task::factory()->for($user)->completed()->create([
        'scheduled_at' => now()->addDay(),
    ]);

    $this->actingAs($user)
        ->get('/upcoming')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Upcoming')
            ->where('grouped_tasks', fn ($grouped) => collect($grouped)->flatten(1)->count() === 1)
        );
});

it('requires authentication for anytime page', function () {
    $this->get('/anytime')
        ->assertRedirect('/login');
});

it('renders the anytime page with tasks', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->anytime()->count(2)->create();

    $this->actingAs($user)
        ->get('/anytime')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Anytime')
            ->has('tasks', 2)
        );
});

it('excludes completed tasks from anytime', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->anytime()->create();
    Task::factory()->for($user)->completed()->create(['status' => 'anytime']);

    $this->actingAs($user)
        ->get('/anytime')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Anytime')
            ->has('tasks', 1)
        );
});

it('requires authentication for someday page', function () {
    $this->get('/someday')
        ->assertRedirect('/login');
});

it('renders the someday page with tasks', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->someday()->count(3)->create();

    $this->actingAs($user)
        ->get('/someday')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Someday')
            ->has('tasks', 3)
        );
});

it('requires authentication for logbook page', function () {
    $this->get('/logbook')
        ->assertRedirect('/login');
});

it('renders the logbook page with completed tasks', function () {
    $user = User::factory()->create();
    Task::factory()->for($user)->completed()->count(2)->create();
    // Active task should not appear
    Task::factory()->for($user)->inbox()->create();

    $this->actingAs($user)
        ->get('/logbook')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Logbook')
            ->has('tasks.data', 2)
            ->has('tasks.meta')
            ->has('tasks.links')
        );
});

it('scopes logbook to own tasks only', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    Task::factory()->for($user)->completed()->create();
    Task::factory()->for($otherUser)->completed()->create();

    $this->actingAs($user)
        ->get('/logbook')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Logbook')
            ->has('tasks.data', 1)
        );
});

it('requires authentication for sections show page', function () {
    $user = User::factory()->create();
    $section = Section::factory()->forUser($user)->create();

    $this->get("/sections/{$section->id}")
        ->assertRedirect('/login');
});

it('renders section show page', function () {
    $user = User::factory()->create();
    $section = Section::factory()->forUser($user)->create();

    $this->actingAs($user)
        ->get("/sections/{$section->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Sections/Show')
            ->has('section')
            ->has('projects')
            ->has('tasks')
        );
});

it('prevents access to other users sections', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $section = Section::factory()->forUser($otherUser)->create();

    $this->actingAs($user)
        ->get("/sections/{$section->id}")
        ->assertStatus(403);
});

it('requires authentication for groups index page', function () {
    $this->get('/groups')
        ->assertRedirect('/login');
});

it('renders groups index page', function () {
    $user = User::factory()->create();
    $group = Group::factory()->forUser($user)->create();
    $group->members()->attach($user->id, ['role' => 'admin']);

    $this->actingAs($user)
        ->get('/groups')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Groups/Index')
            ->has('groups', 1)
        );
});

it('renders groups show page', function () {
    $user = User::factory()->create();
    $group = Group::factory()->forUser($user)->create();
    $group->members()->attach($user->id, ['role' => 'admin']);

    $this->actingAs($user)
        ->get("/groups/{$group->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Groups/Show')
            ->has('group')
            ->has('members')
            ->has('tasks')
        );
});

it('prevents non-members from viewing group show page', function () {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $group = Group::factory()->forUser($owner)->create();
    $group->members()->attach($owner->id, ['role' => 'admin']);

    $this->actingAs($outsider)
        ->get("/groups/{$group->id}")
        ->assertStatus(403);
});
