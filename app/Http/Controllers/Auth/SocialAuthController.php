<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the provider's authentication page.
     */
    public function redirect(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle the callback from the provider.
     */
    public function callback(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        $socialUser = Socialite::driver($provider)->user();

        // Extract token metadata
        $tokenData = [
            'provider_token' => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken,
            'token_expires_at' => isset($socialUser->expiresIn)
                ? now()->addSeconds($socialUser->expiresIn)
                : null,
            'scopes' => $socialUser->approvedScopes ?? [],
        ];

        $socialAccount = SocialAccount::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($socialAccount) {
            // Preserve existing refresh token if the new one is null
            if (! $tokenData['provider_refresh_token']) {
                unset($tokenData['provider_refresh_token']);
            }

            $socialAccount->update($tokenData);

            Auth::login($socialAccount->user);

            return redirect()->route('dashboard');
        }

        // Check if a user with this email already exists
        $user = User::where('email', $socialUser->getEmail())->first();

        if (! $user) {
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(Str::random(24)),
                'avatar' => $socialUser->getAvatar(),
                'timezone' => 'UTC',
            ]);
        }

        $user->socialAccounts()->create(array_merge([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ], $tokenData));

        Auth::login($user);

        return redirect()->route('dashboard');
    }

    /**
     * Validate the given provider is supported.
     */
    private function validateProvider(string $provider): void
    {
        $allowed = ['google', 'github', 'apple'];

        if (! in_array($provider, $allowed, true)) {
            abort(404, "Social provider [{$provider}] is not supported.");
        }
    }
}
