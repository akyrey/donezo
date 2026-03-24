<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (
            class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)
            && $this->app->environment('local')
        ) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(!$this->app->isProduction());
        Model::preventSilentlyDiscardingAttributes(!$this->app->isProduction());

        Vite::prefetch(concurrency: 3);

        if ($this->app->isLocal() && config('app.version') === '0.0.1-dev') {
            $version = mb_trim((string) shell_exec('git describe --tags --always 2>/dev/null'));
            if ($version !== '') {
                config(['app.version' => $version]);
            }
        }
    }
}
