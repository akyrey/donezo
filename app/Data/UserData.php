<?php

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class UserData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $avatar,
        public readonly string $timezone,
        public readonly ?Carbon $email_verified_at,
    ) {}
}
