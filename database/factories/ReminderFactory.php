<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Reminder>
 */
final class ReminderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'task_id' => Task::factory(),
            'remind_at' => fake()->dateTimeBetween('+1 hour', '+2 weeks'),
            'is_sent' => false,
        ];
    }

    /**
     * Create a reminder that has already been sent.
     */
    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_sent' => true,
            'remind_at' => fake()->dateTimeBetween('-2 weeks', '-1 hour'),
        ]);
    }

    /**
     * Assign the reminder to a specific task.
     */
    public function forTask(Task $task): static
    {
        return $this->state(fn (array $attributes) => [
            'task_id' => $task->id,
        ]);
    }
}
