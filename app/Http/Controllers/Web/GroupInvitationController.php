<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\GroupInvitation;
use Inertia\Inertia;
use Inertia\Response;

final class GroupInvitationController extends Controller
{
    /**
     * Show the accept-invitation page for an existing authenticated user.
     */
    public function show(string $token): Response
    {
        $invitation = GroupInvitation::where('token', $token)
            ->whereNull('accepted_at')
            ->firstOrFail();

        $invitation->load(['group', 'inviter']);

        return Inertia::render('Groups/AcceptInvitation', [
            'invitation' => [
                'token' => $invitation->token,
                'email' => $invitation->email,
                'role' => $invitation->role,
                'expired' => $invitation->isExpired(),
                'group' => [
                    'id' => $invitation->group->id,
                    'name' => $invitation->group->name,
                    'description' => $invitation->group->description,
                ],
                'inviter' => [
                    'name' => $invitation->inviter->name,
                ],
                'expires_at' => $invitation->expires_at->toIso8601String(),
            ],
        ]);
    }
}
