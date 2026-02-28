<?php

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

class ProjectData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly ?string $description,
        public readonly string $status,
        public readonly int $position,
        public readonly ?int $section_id,
        public readonly ?Carbon $completed_at,
        /** @var DataCollection<int, HeadingData>|null */
        #[DataCollectionOf(HeadingData::class)]
        public readonly ?DataCollection $headings,
        public readonly int $task_count,
        public readonly int $completed_task_count,
        public readonly Carbon $created_at,
        public readonly Carbon $updated_at,
    ) {}
}
