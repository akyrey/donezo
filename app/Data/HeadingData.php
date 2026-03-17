<?php

declare(strict_types=1);

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

final class HeadingData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly int $position,
        public readonly ?Carbon $archived_at,
        public readonly int $task_count,
    ) {}
}
