<?php

declare(strict_types=1);

use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can determine if token is expired', function () {
    $user = User::factory()->create();

    $expired = SocialAccount::factory()->forUser($user)->expired()->create();
    expect($expired->isTokenExpired())->toBeTrue();

    $valid = SocialAccount::factory()->forUser($user)->create([
        'token_expires_at' => now()->addHour(),
    ]);
    expect($valid->isTokenExpired())->toBeFalse();
});

it('returns expired when token_expires_at is null', function () {
    $user = User::factory()->create();
    $account = SocialAccount::factory()->forUser($user)->create([
        'token_expires_at' => null,
    ]);

    expect($account->isTokenExpired())->toBeTrue();
});

it('can check for a specific scope', function () {
    $user = User::factory()->create();
    $account = SocialAccount::factory()->forUser($user)->create([
        'scopes' => ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
    ]);

    expect($account->hasScope('email'))->toBeTrue();
    expect($account->hasScope('profile'))->toBeTrue();
    expect($account->hasScope('https://www.googleapis.com/auth/calendar'))->toBeTrue();
    expect($account->hasScope('nonexistent'))->toBeFalse();
});

it('returns false for scope when scopes is null', function () {
    $user = User::factory()->create();
    $account = SocialAccount::factory()->forUser($user)->create([
        'scopes' => null,
    ]);

    expect($account->hasScope('anything'))->toBeFalse();
});

it('can determine calendar access', function () {
    $user = User::factory()->create();

    $withAccess = SocialAccount::factory()->forUser($user)->withCalendarAccess()->create();
    expect($withAccess->hasCalendarAccess())->toBeTrue();

    $withoutAccess = SocialAccount::factory()->forUser($user)->create([
        'provider' => 'google',
        'provider_id' => '99999',
        'scopes' => ['email'],
    ]);
    expect($withoutAccess->hasCalendarAccess())->toBeFalse();
});

it('denies calendar access for non-google providers', function () {
    $user = User::factory()->create();
    $github = SocialAccount::factory()->forUser($user)->github()->create([
        'scopes' => ['https://www.googleapis.com/auth/calendar'],
    ]);

    expect($github->hasCalendarAccess())->toBeFalse();
});

it('belongs to a user', function () {
    $user = User::factory()->create();
    $account = SocialAccount::factory()->forUser($user)->create();

    expect($account->user)->toBeInstanceOf(User::class);
    expect($account->user->id)->toBe($user->id);
});

it('has correct fillable attributes', function () {
    $account = new SocialAccount();

    expect($account->getFillable())->toMatchArray([
        'user_id', 'provider', 'provider_id', 'provider_token',
        'provider_refresh_token', 'token_expires_at', 'scopes',
    ]);
});

it('casts attributes correctly', function () {
    $user = User::factory()->create();
    $account = SocialAccount::factory()->forUser($user)->create([
        'token_expires_at' => '2025-06-15 12:00:00',
        'scopes' => ['email', 'profile'],
    ]);

    expect($account->token_expires_at)->toBeInstanceOf(Illuminate\Support\Carbon::class);
    expect($account->scopes)->toBeArray();
});
