<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class CreateProjectData extends Data
{
    public function __construct(
        #[Required, Max(255)]
        public readonly string $name,
        #[Nullable, Max(5000)]
        public readonly ?string $description = null,
        #[Nullable, Exists('sections', 'id')]
        public readonly ?int $section_id = null,
    ) {}
}
