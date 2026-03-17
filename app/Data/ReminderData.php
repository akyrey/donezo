<?php

declare(strict_types=1);

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

final class ReminderData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly Carbon $remind_at,
        public readonly bool $is_sent,
    ) {}
}
