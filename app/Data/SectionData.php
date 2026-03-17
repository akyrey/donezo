<?php

declare(strict_types=1);

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

final class SectionData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly int $position,
        /** @var DataCollection<int, ProjectData>|null */
        #[DataCollectionOf(ProjectData::class)]
        public readonly ?DataCollection $projects,
        public readonly Carbon $created_at,
        public readonly Carbon $updated_at,
    ) {}
}
