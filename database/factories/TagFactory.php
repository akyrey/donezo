<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
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
            'name' => fake()->unique()->randomElement([
                'urgent', 'email', 'meeting', 'errand',
                'review', 'follow-up', 'waiting', 'research',
                'creative', 'admin', 'finance', 'health',
            ]),
            'color' => fake()->optional(0.6)->hexColor(),
        ];
    }

    /**
     * Create a tag for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
