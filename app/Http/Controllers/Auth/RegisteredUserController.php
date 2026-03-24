<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\GroupInvitation;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

final class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     * Accepts an optional ?invitation= token query param pre-filled from invitation emails.
     */
    public function create(Request $request): Response
    {
        $invitationToken = $request->query('invitation');
        $invitationEmail = null;

        if ($invitationToken) {
            $invitation = GroupInvitation::where('token', $invitationToken)
                ->whereNull('accepted_at')
                ->where('expires_at', '>', now())
                ->first();

            if ($invitation) {
                $invitationEmail = $invitation->email;
            }
        }

        return Inertia::render('Auth/Register', [
            'invitationToken' => $invitationToken,
            'invitationEmail' => $invitationEmail,
        ]);
    }

    /**
     * Handle an incoming registration request.
     * If an invitation token is submitted, auto-accept it after creating the account.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'invitation_token' => ['sometimes', 'nullable', 'string'],
        ]);

        $user = User::create([
            'name' => (string) $request->string('name'),
            'email' => (string) $request->string('email'),
            'password' => Hash::make((string) $request->string('password')),
            'timezone' => (string) $request->string('timezone', 'UTC'),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Auto-accept a pending group invitation tied to this email
        if ($request->filled('invitation_token')) {
            $invitation = GroupInvitation::where('token', $request->string('invitation_token'))
                ->whereNull('accepted_at')
                ->where('expires_at', '>', now())
                ->where('email', mb_strtolower($user->email))
                ->first();

            if ($invitation) {
                $group = $invitation->group;
                if (!$group->members()->where('user_id', $user->id)->exists()) {
                    $group->members()->attach($user->id, ['role' => $invitation->role]);
                }
                $invitation->update(['accepted_at' => now()]);

                return redirect()->route('verification.notice');
            }
        }

        return redirect()->route('verification.notice');
    }
}
