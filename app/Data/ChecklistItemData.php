<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

final class ChecklistItemData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly bool $is_completed,
        public readonly int $position,
    ) {}
}
