<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class SocialAccountData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $provider,
        public readonly string $created_at,
    ) {}
}
