<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateSectionData extends Data
{
    public function __construct(
        #[Max(255)]
        public readonly string|Optional $name = new Optional(),
    ) {}
}
