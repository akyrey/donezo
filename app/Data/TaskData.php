<?php

declare(strict_types=1);

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

final class TaskData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly ?string $description,
        public readonly string $status,
        public readonly bool $is_evening,
        public readonly ?Carbon $scheduled_at,
        public readonly ?Carbon $deadline_at,
        public readonly ?Carbon $completed_at,
        public readonly ?Carbon $cancelled_at,
        public readonly ?RepeatRuleData $repeat_rule,
        public readonly int $position,
        public readonly ?int $project_id,
        public readonly ?int $section_id,
        public readonly ?int $heading_id,
        public readonly ?string $google_calendar_event_id,
        public readonly ?UserData $creator,
        public readonly ?UserData $assignee,
        /** @var DataCollection<int, ChecklistItemData>|null */
        #[DataCollectionOf(ChecklistItemData::class)]
        public readonly ?DataCollection $checklist_items,
        /** @var DataCollection<int, ReminderData>|null */
        #[DataCollectionOf(ReminderData::class)]
        public readonly ?DataCollection $reminders,
        /** @var DataCollection<int, TagData>|null */
        #[DataCollectionOf(TagData::class)]
        public readonly ?DataCollection $tags,
        public readonly Carbon $created_at,
        public readonly Carbon $updated_at,
    ) {}
}
