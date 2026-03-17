<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

final class GroupData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly ?string $description,
        public readonly UserData $owner,
        public readonly int $member_count,
    ) {}
}
