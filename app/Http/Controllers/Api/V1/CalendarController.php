<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\SyncTaskToCalendar;
use App\Services\GoogleCalendarService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

final class CalendarController extends Controller
{
    /**
     * Get the current calendar connection status.
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        $googleAccount = $user->socialAccounts()
            ->where('provider', 'google')
            ->first();

        if (!$googleAccount) {
            return response()->json([
                'connected' => false,
                'has_calendar_scope' => false,
                'enabled' => (bool) env('GOOGLE_CALENDAR_ENABLED', false),
            ]);
        }

        return response()->json([
            'connected' => true,
            'has_calendar_scope' => $googleAccount->hasCalendarAccess(),
            'token_expired' => $googleAccount->isTokenExpired(),
            'enabled' => (bool) env('GOOGLE_CALENDAR_ENABLED', false),
        ]);
    }

    /**
     * Redirect to Google OAuth with Calendar scope.
     */
    public function connect(Request $request): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes([GoogleCalendarService::CALENDAR_SCOPE])
            ->with(['access_type' => 'offline', 'prompt' => 'consent'])
            ->redirect();
    }

    /**
     * Handle the callback from Google Calendar OAuth.
     */
    public function callback(Request $request): RedirectResponse
    {
        try {
            $socialUser = Socialite::driver('google')->user();

            $user = $request->user();
            $googleAccount = $user->socialAccounts()
                ->where('provider', 'google')
                ->first();

            $scopes = explode(' ', $socialUser->approvedScopes ?? '');

            if ($googleAccount) {
                $googleAccount->update([
                    'provider_token' => $socialUser->token,
                    'provider_refresh_token' => $socialUser->refreshToken ?? $googleAccount->provider_refresh_token,
                    'token_expires_at' => now()->addSeconds($socialUser->expiresIn ?? 3600),
                    'scopes' => $scopes,
                ]);
            } else {
                $user->socialAccounts()->create([
                    'provider' => 'google',
                    'provider_id' => $socialUser->getId(),
                    'provider_token' => $socialUser->token,
                    'provider_refresh_token' => $socialUser->refreshToken,
                    'token_expires_at' => now()->addSeconds($socialUser->expiresIn ?? 3600),
                    'scopes' => $scopes,
                ]);
            }

            return redirect()->route('settings')
                ->with('success', 'Google Calendar connected successfully.');
        } catch (Exception $e) {
            Log::error('Google Calendar OAuth callback failed', [
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('settings')
                ->with('error', 'Failed to connect Google Calendar. Please try again.');
        }
    }

    /**
     * Disconnect Google Calendar (remove calendar scope, keep social login).
     */
    public function disconnect(Request $request): JsonResponse
    {
        $googleAccount = $request->user()->socialAccounts()
            ->where('provider', 'google')
            ->first();

        if ($googleAccount) {
            // Remove calendar scope but keep the social account for login
            $scopes = $googleAccount->scopes ?? [];
            $scopes = array_values(array_filter(
                $scopes,
                fn (string $s) => $s !== GoogleCalendarService::CALENDAR_SCOPE,
            ));
            $googleAccount->update(['scopes' => $scopes]);

            // Clear all google_calendar_event_id from user's tasks
            $request->user()->tasks()->whereNotNull('google_calendar_event_id')
                ->update(['google_calendar_event_id' => null]);
        }

        return response()->json(['message' => 'Google Calendar disconnected.']);
    }

    /**
     * Sync all unsynced tasks to Google Calendar.
     */
    public function sync(Request $request): JsonResponse
    {
        $googleAccount = $request->user()->socialAccounts()
            ->where('provider', 'google')
            ->first();

        if (!$googleAccount || !$googleAccount->hasCalendarAccess()) {
            return response()->json([
                'message' => 'Google Calendar is not connected.',
            ], 422);
        }

        // Queue sync for all active tasks that have a scheduled_at or deadline_at
        $tasks = $request->user()->tasks()
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->where(function ($q) {
                $q->whereNotNull('scheduled_at')
                    ->orWhereNotNull('deadline_at');
            })
            ->get();

        foreach ($tasks as $task) {
            SyncTaskToCalendar::dispatch($task->id);
        }

        return response()->json([
            'message' => "Queued {$tasks->count()} tasks for calendar sync.",
            'count' => $tasks->count(),
        ]);
    }
}
