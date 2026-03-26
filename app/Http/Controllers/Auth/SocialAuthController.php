<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\GroupInvitation;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

final class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the provider's authentication page.
     */
    public function redirect(string $provider, Request $request): SymfonyRedirectResponse
    {
        $this->validateProvider($provider);

        if ($request->filled('invitation')) {
            session()->put('invitation_token', $request->string('invitation')->toString());
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the callback from the provider.
     */
    public function callback(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        /** @var \Laravel\Socialite\Two\User $socialUser */
        $socialUser = Socialite::driver($provider)->user();

        // Extract token metadata
        $tokenData = [
            'provider_token' => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken,
            'token_expires_at' => $socialUser->expiresIn
                ? now()->addSeconds($socialUser->expiresIn)
                : null,
            'scopes' => $socialUser->approvedScopes,
        ];

        $socialAccount = SocialAccount::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($socialAccount) {
            // Preserve existing refresh token if the new one is null
            if (!$tokenData['provider_refresh_token']) {
                unset($tokenData['provider_refresh_token']);
            }

            $socialAccount->update($tokenData);

            Auth::login($socialAccount->user);

            return redirect()->route('dashboard');
        }

        // Check if a user with this email already exists
        $user = User::where('email', $socialUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(Str::random(24)),
                'avatar' => $socialUser->getAvatar(),
                'email_verified_at' => now(),
                'timezone' => 'UTC',
            ]);
        } elseif (!$user->hasVerifiedEmail()) {
            // OAuth provider has verified ownership of this email address
            $user->markEmailAsVerified();
        }

        $user->socialAccounts()->create(array_merge([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ], $tokenData));

        Auth::login($user);

        // Auto-accept a pending group invitation stored before the OAuth redirect
        $invitationToken = session()->pull('invitation_token');
        if ($invitationToken) {
            $invitation = GroupInvitation::where('token', $invitationToken)
                ->whereNull('accepted_at')
                ->where('expires_at', '>', now())
                ->where('email', mb_strtolower($user->email))
                ->first();

            if ($invitation) {
                $group = $invitation->group;
                if (!$group->members()->where('user_id', $user->id)->exists()) {
                    $group->addMember($user, $invitation->role);
                }
                $invitation->update(['accepted_at' => now()]);
            }
        }

        return redirect()->route('dashboard');
    }

    /**
     * Validate the given provider is supported.
     */
    private function validateProvider(string $provider): void
    {
        $allowed = ['google', 'github'];

        if (!in_array($provider, $allowed, true)) {
            abort(404, "Social provider [{$provider}] is not supported.");
        }
    }
}
