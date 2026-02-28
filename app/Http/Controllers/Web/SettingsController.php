<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $googleAccount = $user->socialAccounts()->where('provider', 'google')->first();

        return Inertia::render('Settings/Index', [
            'settings' => $user->settings ?? [],
            'calendarStatus' => [
                'connected' => $googleAccount !== null,
                'has_calendar_scope' => $googleAccount?->hasCalendarAccess() ?? false,
                'token_expired' => $googleAccount?->isTokenExpired() ?? false,
                'enabled' => (bool) env('GOOGLE_CALENDAR_ENABLED', false),
            ],
            'hasGoogleAccount' => $googleAccount !== null,
            'hasPushSubscriptions' => $user->pushSubscriptions()->exists(),
        ]);
    }

    /**
     * Update the user's settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
            'timezone' => ['sometimes', 'string', 'timezone'],
            'settings' => ['sometimes', 'array'],
            'settings.default_view' => ['sometimes', 'string', 'in:inbox,today,upcoming,anytime'],
            'settings.start_of_week' => ['sometimes', 'integer', 'min:0', 'max:6'],
            'settings.evening_start_time' => ['sometimes', 'string'],
        ]);

        $request->user()->update($validated);

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
