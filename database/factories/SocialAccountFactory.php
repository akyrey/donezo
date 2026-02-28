<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\SocialAccount>
 */
class SocialAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'provider' => 'google',
            'provider_id' => (string) fake()->unique()->randomNumber(8),
            'provider_token' => fake()->sha256(),
            'provider_refresh_token' => fake()->sha256(),
            'token_expires_at' => now()->addHour(),
            'scopes' => [],
        ];
    }

    /**
     * Create a social account for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Google account with calendar access.
     */
    public function withCalendarAccess(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'google',
            'scopes' => ['https://www.googleapis.com/auth/calendar'],
        ]);
    }

    /**
     * Account with an expired token.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'token_expires_at' => now()->subHour(),
        ]);
    }

    /**
     * GitHub provider.
     */
    public function github(): static
    {
        return $this->state(fn (array $attributes) => [
            'provider' => 'github',
            'scopes' => [],
        ]);
    }
}
