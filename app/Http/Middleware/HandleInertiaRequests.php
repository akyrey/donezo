<?php

namespace App\Http\Middleware;

use App\Data\ProjectData;
use App\Data\SectionData;
use App\Data\UserData;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user()
                    ? UserData::from($request->user())
                    : null,
            ],
            'projects' => fn () => $request->user()
                ? ProjectData::collect(
                    $request->user()
                        ->projects()
                        ->where('status', 'active')
                        ->withCount(['tasks', 'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at')])
                        ->orderBy('position')
                        ->get()
                )
                : [],
            'sections' => fn () => $request->user()
                ? SectionData::collect(
                    $request->user()
                        ->sections()
                        ->orderBy('position')
                        ->get()
                )
                : [],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'ziggy' => fn () => [
                ...(new \Tighten\Ziggy\Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ]);
    }
}
