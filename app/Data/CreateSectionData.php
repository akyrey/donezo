<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class CreateSectionData extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public readonly string $name,
    ) {}
}
