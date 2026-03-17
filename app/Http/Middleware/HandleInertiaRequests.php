<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Data\GroupData;
use App\Data\ProjectData;
use App\Data\SectionData;
use App\Data\UserData;
use App\Observers\TaskObserver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

final class HandleInertiaRequests extends Middleware
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
            'task_counts' => fn () => $request->user()
                ? Cache::remember(
                    TaskObserver::cacheKey($request->user()->id),
                    now()->addHours(6),
                    fn () => $request->user()
                        ->tasks()
                        ->whereIn('status', ['inbox', 'today', 'upcoming', 'anytime', 'someday'])
                        ->selectRaw('status, count(*) as count')
                        ->groupBy('status')
                        ->pluck('count', 'status')
                        ->toArray()
                )
                : [],
            'projects' => fn () => $request->user()
                ? ProjectData::collect(
                    $request->user()
                        ->projects()
                        ->where('status', 'active')
                        ->withCount(['tasks as task_count', 'tasks as completed_task_count' => fn ($q) => $q->whereNotNull('completed_at')])
                        ->with(['headings' => fn ($q) => $q->orderBy('position')->withCount('tasks as task_count')])
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
            'groups' => fn () => $request->user()
                ? GroupData::collect(
                    $request->user()
                        ->groups()
                        ->with('owner')
                        ->withCount('members as member_count')
                        ->get()
                        ->merge(
                            $request->user()
                                ->ownedGroups()
                                ->with('owner')
                                ->withCount('members as member_count')
                                ->get()
                        )
                        ->unique('id')
                        ->values()
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
