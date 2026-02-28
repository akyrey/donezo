<?php

use App\Models\User;

it('can render login page', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('Auth/Login'));
});

it('can authenticate a user', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard'));
});

it('cannot authenticate with invalid credentials', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

it('can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'web')->post('/logout');

    $this->assertGuest('web');
    $response->assertRedirect(route('login'));
});
