<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

final class UpdateProjectData extends Data
{
    public function __construct(
        #[Max(255)]
        public readonly string|Optional $name = new Optional(),
        #[Nullable, Max(5000)]
        public readonly string|null|Optional $description = new Optional(),
        #[Nullable, Exists('sections', 'id')]
        public readonly int|null|Optional $section_id = new Optional(),
    ) {}
}
