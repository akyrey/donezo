<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Data;

final class RepeatRuleData extends Data
{
    public function __construct(
        #[In('daily', 'weekly', 'monthly', 'yearly')]
        public readonly string $frequency,
        #[Min(1)]
        public readonly int $interval = 1,
        /** @var list<int>|null */
        #[Nullable]
        public readonly ?array $days_of_week = null,
        #[Nullable]
        public readonly ?string $end_date = null,
    ) {}
}
