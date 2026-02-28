<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateTaskData extends Data
{
    public function __construct(
        #[Max(500)]
        public readonly string|Optional $title = new Optional(),
        #[Nullable, Max(10000)]
        public readonly string|null|Optional $description = new Optional(),
        #[In('inbox', 'today', 'upcoming', 'anytime', 'someday')]
        public readonly string|Optional $status = new Optional(),
        public readonly bool|Optional $is_evening = new Optional(),
        #[Nullable, DateFormat('Y-m-d')]
        public readonly string|null|Optional $scheduled_at = new Optional(),
        #[Nullable, DateFormat('Y-m-d')]
        public readonly string|null|Optional $deadline_at = new Optional(),
        public readonly RepeatRuleData|null|Optional $repeat_rule = new Optional(),
        #[Nullable, Exists('projects', 'id')]
        public readonly int|null|Optional $project_id = new Optional(),
        #[Nullable, Exists('sections', 'id')]
        public readonly int|null|Optional $section_id = new Optional(),
        #[Nullable, Exists('headings', 'id')]
        public readonly int|null|Optional $heading_id = new Optional(),
        #[Nullable, Exists('users', 'id')]
        public readonly int|null|Optional $assigned_to = new Optional(),
        /** @var int[]|Optional */
        public readonly array|Optional $tags = new Optional(),
        /** @var array<int, array{title: string}>|Optional */
        public readonly array|Optional $checklist_items = new Optional(),
        /** @var array<int, array{remind_at: string}>|Optional */
        public readonly array|Optional $reminders = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'tags' => ['sometimes', 'nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
            'checklist_items' => ['sometimes', 'nullable', 'array'],
            'checklist_items.*.title' => ['required', 'string', 'max:500'],
            'reminders' => ['sometimes', 'nullable', 'array'],
            'reminders.*.remind_at' => ['required', 'date'],
        ];
    }
}
