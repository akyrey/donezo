<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

it('verification notice page is displayed for unverified user', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get('/email/verify')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Auth/VerifyEmail'));
});

it('verified user is redirected from verification notice to dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/email/verify')
        ->assertRedirect(route('dashboard'));
});

it('email can be verified via signed url', function () {
    $user = User::factory()->unverified()->create();

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)],
    );

    $this->actingAs($user)
        ->get($url)
        ->assertRedirect(route('dashboard'));

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

it('verification fails with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => 'wrong-hash'],
    );

    $this->actingAs($user)
        ->get($url)
        ->assertForbidden();
});

it('verification notification can be resent', function () {
    Notification::fake();

    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->post('/email/verification-notification')
        ->assertRedirect()
        ->assertSessionHas('status', 'verification-link-sent');

    Notification::assertSentTo($user, VerifyEmail::class);
});

it('verified user cannot resend verification notification', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/email/verification-notification')
        ->assertRedirect(route('dashboard'));

    Notification::assertNothingSent();
});

it('unverified user is redirected to verification notice from protected routes', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get('/inbox')
        ->assertRedirect(route('verification.notice'));
});

it('verified user can access protected routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/inbox')
        ->assertOk();
});

it('guest cannot access verification notice', function () {
    $this->get('/email/verify')
        ->assertRedirect(route('login'));
});
