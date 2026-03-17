<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

final class SocialAccountData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $provider,
        public readonly string $created_at,
    ) {}
}
