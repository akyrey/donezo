<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class CreateTaskData extends Data
{
    public function __construct(
        #[Required, Max(500)]
        public readonly string $title,
        #[Nullable, Max(10000)]
        public readonly ?string $description = null,
        #[In('inbox', 'today', 'upcoming', 'anytime', 'someday')]
        public readonly string $status = 'inbox',
        public readonly bool $is_evening = false,
        #[Nullable, DateFormat('Y-m-d')]
        public readonly ?string $scheduled_at = null,
        #[Nullable, DateFormat('Y-m-d')]
        public readonly ?string $deadline_at = null,
        public readonly ?RepeatRuleData $repeat_rule = null,
        #[Nullable, Exists('projects', 'id')]
        public readonly ?int $project_id = null,
        #[Nullable, Exists('sections', 'id')]
        public readonly ?int $section_id = null,
        #[Nullable, Exists('headings', 'id')]
        public readonly ?int $heading_id = null,
        #[Nullable, Exists('users', 'id')]
        public readonly ?int $assigned_to = null,
        /** @var int[]|null */
        public readonly ?array $tags = null,
        /** @var array<int, array{title: string}>|null */
        public readonly ?array $checklist_items = null,
        /** @var array<int, array{remind_at: string}>|null */
        public readonly ?array $reminders = null,
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
