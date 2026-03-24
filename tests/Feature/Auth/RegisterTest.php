<?php

declare(strict_types=1);

use App\Models\User;

it('can render register page', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('Auth/Register'));
});

it('can register a new user', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'password123!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.notice'));
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'name' => 'Test User',
    ]);
});

it('validates required fields', function () {
    $response = $this->post('/register', []);

    $response->assertSessionHasErrors(['name', 'email', 'password']);
});

it('validates email is unique', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'taken@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'password123!',
    ]);

    $response->assertSessionHasErrors('email');
});

it('validates password confirmation', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123!',
        'password_confirmation' => 'different-password',
    ]);

    $response->assertSessionHasErrors('password');
});
