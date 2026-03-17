<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\PushSubscription>
 */
final class PushSubscriptionFactory extends Factory
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
            'endpoint' => fake()->url() . '/push/' . fake()->uuid(),
            'p256dh_key' => fake()->sha256(),
            'auth_token' => fake()->sha256(),
            'content_encoding' => 'aesgcm',
        ];
    }

    /**
     * Create a subscription for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
