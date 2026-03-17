<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Section;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Project>
 */
final class ProjectFactory extends Factory
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
            'section_id' => null,
            'name' => fake()->words(fake()->numberBetween(2, 4), true),
            'description' => fake()->optional(0.5)->sentence(),
            'status' => 'active',
            'position' => fake()->numberBetween(0, 50),
            'completed_at' => null,
        ];
    }

    /**
     * Assign the project to a section.
     */
    public function forSection(Section $section): static
    {
        return $this->state(fn (array $attributes) => [
            'section_id' => $section->id,
            'user_id' => $section->user_id,
        ]);
    }

    /**
     * Completed project.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }
}
