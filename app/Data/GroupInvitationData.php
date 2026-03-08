<?php

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class GroupInvitationData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $group_id,
        public readonly string $email,
        public readonly string $token,
        public readonly string $role,
        public readonly ?Carbon $accepted_at,
        public readonly Carbon $expires_at,
        public readonly Carbon $created_at,
    ) {}
}
