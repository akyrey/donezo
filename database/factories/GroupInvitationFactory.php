<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\GroupInvitation>
 */
final class GroupInvitationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group_id' => Group::factory(),
            'invited_by' => User::factory(),
            'email' => fake()->unique()->safeEmail(),
            'token' => Str::random(64),
            'role' => 'member',
            'accepted_at' => null,
            'expires_at' => now()->addDays(7),
        ];
    }

    /**
     * Pending invitation (not yet accepted, not expired).
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'accepted_at' => null,
            'expires_at' => now()->addDays(7),
        ]);
    }

    /**
     * Accepted invitation.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'accepted_at' => now()->subHour(),
            'expires_at' => now()->addDays(6),
        ]);
    }

    /**
     * Expired invitation.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'accepted_at' => null,
            'expires_at' => now()->subDay(),
        ]);
    }

    /**
     * Invitation for a specific group.
     */
    public function forGroup(Group $group): static
    {
        return $this->state(fn (array $attributes) => [
            'group_id' => $group->id,
        ]);
    }

    /**
     * Invitation sent by a specific user.
     */
    public function invitedBy(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'invited_by' => $user->id,
        ]);
    }

    /**
     * Invitation for a specific email address.
     */
    public function forEmail(string $email): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => mb_strtolower($email),
        ]);
    }
}
