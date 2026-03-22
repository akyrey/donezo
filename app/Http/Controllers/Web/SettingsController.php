<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Data\SocialAccountData;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

final class SettingsController extends Controller
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
                'enabled' => (bool) config('services.google.calendar_enabled'),
            ],
            'hasGoogleAccount' => $googleAccount !== null,
            'hasPushSubscriptions' => $user->pushSubscriptions()->exists(),
            'socialAccounts' => SocialAccountData::collect($user->socialAccounts()->get()),
            'hasPassword' => $user->password !== null,
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

    /**
     * Update the user's profile information (name and email).
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the user's preferences (timezone, etc.).
     */
    public function updatePreferences(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'timezone' => ['required', 'string', 'timezone'],
        ]);

        $request->user()->update($validated);

        return redirect()->back()->with('success', 'Preferences updated successfully.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Your account has been deleted.');
    }
}
