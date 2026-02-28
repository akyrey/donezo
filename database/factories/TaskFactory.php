<?php

namespace Database\Factories;

use App\Models\Heading;
use App\Models\Project;
use App\Models\Section;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['inbox', 'today', 'upcoming', 'anytime', 'someday']);

        return [
            'user_id' => User::factory(),
            'project_id' => null,
            'section_id' => null,
            'heading_id' => null,
            'title' => fake()->sentence(fake()->numberBetween(3, 8)),
            'description' => fake()->optional(0.4)->paragraph(),
            'status' => $status,
            'is_evening' => fake()->boolean(15),
            'scheduled_at' => fake()->optional(0.3)->dateTimeBetween('now', '+2 weeks'),
            'deadline_at' => fake()->optional(0.2)->dateTimeBetween('+1 day', '+1 month'),
            'completed_at' => null,
            'cancelled_at' => null,
            'repeat_rule' => null,
            'position' => fake()->numberBetween(0, 100),
            'created_by' => fn (array $attributes) => $attributes['user_id'],
            'assigned_to' => null,
        ];
    }

    /**
     * Task with inbox status.
     */
    public function inbox(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inbox',
        ]);
    }

    /**
     * Task with today status.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'today',
        ]);
    }

    /**
     * Task with upcoming status.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'upcoming',
            'scheduled_at' => fake()->dateTimeBetween('+1 day', '+2 weeks'),
        ]);
    }

    /**
     * Task with anytime status.
     */
    public function anytime(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'anytime',
        ]);
    }

    /**
     * Task with someday status.
     */
    public function someday(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'someday',
        ]);
    }

    /**
     * Task marked as completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => fake()->dateTimeBetween('-2 weeks', 'now'),
        ]);
    }

    /**
     * Task marked as cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_at' => fake()->dateTimeBetween('-2 weeks', 'now'),
        ]);
    }

    /**
     * Evening task.
     */
    public function evening(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_evening' => true,
        ]);
    }

    /**
     * Assign the task to a project.
     */
    public function forProject(Project $project): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $project->id,
            'user_id' => $project->user_id,
            'created_by' => $project->user_id,
        ]);
    }

    /**
     * Assign the task under a heading.
     */
    public function forHeading(Heading $heading): static
    {
        return $this->state(fn (array $attributes) => [
            'heading_id' => $heading->id,
            'project_id' => $heading->project_id,
        ]);
    }

    /**
     * Assign the task to a section (without a project).
     */
    public function forSection(Section $section): static
    {
        return $this->state(fn (array $attributes) => [
            'section_id' => $section->id,
            'user_id' => $section->user_id,
            'created_by' => $section->user_id,
        ]);
    }

    /**
     * Set a deadline for the task.
     */
    public function withDeadline(): static
    {
        return $this->state(fn (array $attributes) => [
            'deadline_at' => fake()->dateTimeBetween('+1 day', '+1 month'),
        ]);
    }
}
