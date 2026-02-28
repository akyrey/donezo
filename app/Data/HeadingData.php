<?php

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class HeadingData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly int $position,
        public readonly ?Carbon $archived_at,
        public readonly int $task_count,
    ) {}
}
