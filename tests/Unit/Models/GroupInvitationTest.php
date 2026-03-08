<?php

use App\Models\Group;
use App\Models\GroupInvitation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $invitation = new GroupInvitation();

    expect($invitation->getFillable())->toBe([
        'group_id',
        'invited_by',
        'email',
        'token',
        'role',
        'accepted_at',
        'expires_at',
    ]);
});

it('casts accepted_at and expires_at as datetime', function () {
    $casts = (new GroupInvitation())->getCasts();

    expect($casts)->toHaveKey('accepted_at')
        ->and($casts['accepted_at'])->toBe('datetime')
        ->and($casts)->toHaveKey('expires_at')
        ->and($casts['expires_at'])->toBe('datetime');
});

it('belongs to a group', function () {
    $invitation = GroupInvitation::factory()->create();

    expect($invitation->group)->toBeInstanceOf(Group::class);
});

it('belongs to an inviter (user)', function () {
    $invitation = GroupInvitation::factory()->create();

    expect($invitation->inviter)->toBeInstanceOf(User::class);
});

it('isPending returns true when not accepted and not expired', function () {
    $invitation = GroupInvitation::factory()->pending()->create();

    expect($invitation->isPending())->toBeTrue();
});

it('isPending returns false when accepted', function () {
    $invitation = GroupInvitation::factory()->accepted()->create();

    expect($invitation->isPending())->toBeFalse();
});

it('isPending returns false when expired', function () {
    $invitation = GroupInvitation::factory()->expired()->create();

    expect($invitation->isPending())->toBeFalse();
});

it('isExpired returns true when expires_at is in the past', function () {
    $invitation = GroupInvitation::factory()->expired()->create();

    expect($invitation->isExpired())->toBeTrue();
});

it('isExpired returns false when expires_at is in the future', function () {
    $invitation = GroupInvitation::factory()->pending()->create();

    expect($invitation->isExpired())->toBeFalse();
});

it('isAccepted returns true when accepted_at is set', function () {
    $invitation = GroupInvitation::factory()->accepted()->create();

    expect($invitation->isAccepted())->toBeTrue();
});

it('isAccepted returns false when accepted_at is null', function () {
    $invitation = GroupInvitation::factory()->pending()->create();

    expect($invitation->isAccepted())->toBeFalse();
});
