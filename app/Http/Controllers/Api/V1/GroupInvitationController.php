<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Data\GroupInvitationData;
use App\Events\GroupMemberJoined;
use App\Http\Controllers\Controller;
use App\Mail\GroupInvitationMail;
use App\Models\Group;
use App\Models\GroupInvitation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

final class GroupInvitationController extends Controller
{
    /**
     * Invite a user by email to join a group.
     * If the user doesn't exist, send them a registration invitation email.
     */
    public function store(Request $request, Group $group): JsonResponse
    {
        abort_unless($group->owner_id === $request->user()->id, 403);

        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'role' => ['sometimes', 'string', 'in:admin,member'],
        ]);

        $email = mb_strtolower(mb_trim($validated['email']));
        $role = $validated['role'] ?? 'member';

        // Check if target user is already a member
        $existingUser = User::where('email', $email)->first();
        if ($existingUser && $group->members()->where('user_id', $existingUser->id)->exists()) {
            return response()->json(['message' => 'This user is already a member of the group.'], 422);
        }

        // Cancel any existing pending invitation for this email+group combo
        $group->invitations()
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->delete();

        $invitation = $group->invitations()->create([
            'invited_by' => $request->user()->id,
            'email' => $email,
            'token' => Str::random(64),
            'role' => $role,
            'expires_at' => now()->addDays(7),
        ]);

        $invitation->load(['group', 'inviter']);

        $isNewUser = $existingUser === null;

        Mail::to($email)->queue(new GroupInvitationMail($invitation, $isNewUser));

        return response()->json([
            'data' => GroupInvitationData::from($invitation),
            'message' => $isNewUser
                ? 'Invitation sent. The user will receive an email to register and join the group.'
                : 'Invitation sent. The user will receive an email to join the group.',
        ], 201);
    }

    /**
     * List pending invitations for a group (owner only).
     */
    public function index(Request $request, Group $group): JsonResponse
    {
        abort_unless($group->owner_id === $request->user()->id, 403);

        $invitations = $group->invitations()
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => GroupInvitationData::collect($invitations),
        ]);
    }

    /**
     * Cancel / revoke a pending invitation (owner only).
     */
    public function destroy(Request $request, Group $group, GroupInvitation $invitation): JsonResponse
    {
        abort_unless($group->owner_id === $request->user()->id, 403);
        abort_unless($invitation->group_id === $group->id, 404);

        $invitation->delete();

        return response()->json(null, 204);
    }

    /**
     * Accept an invitation by token (authenticated user).
     * Called from the accept-invitation Inertia page.
     */
    public function accept(Request $request, string $token): JsonResponse
    {
        $invitation = GroupInvitation::where('token', $token)
            ->whereNull('accepted_at')
            ->firstOrFail();

        if ($invitation->isExpired()) {
            return response()->json(['message' => 'This invitation has expired.'], 410);
        }

        $user = $request->user();

        // The accepting user's email must match the invitation email
        if (mb_strtolower($user->email) !== mb_strtolower($invitation->email)) {
            return response()->json(['message' => 'This invitation was sent to a different email address.'], 403);
        }

        $group = $invitation->group;

        if ($group->members()->where('user_id', $user->id)->exists()) {
            $invitation->update(['accepted_at' => now()]);

            return response()->json(['message' => 'You are already a member of this group.'], 422);
        }

        $group->members()->attach($user->id, ['role' => $invitation->role]);
        $invitation->update(['accepted_at' => now()]);

        broadcast(new GroupMemberJoined($group->id, $user->id))->toOthers();

        return response()->json([
            'message' => 'You have joined the group.',
            'group_id' => $group->id,
        ]);
    }
}
