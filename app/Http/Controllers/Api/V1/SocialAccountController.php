<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SocialAccountController extends Controller
{
    /**
     * Disconnect (delete) a social account.
     *
     * Refuses to delete if the user has no password set and this is their
     * only remaining social account, to prevent locking them out.
     */
    public function destroy(Request $request, SocialAccount $socialAccount): Response|JsonResponse
    {
        $user = $request->user();

        if ($socialAccount->user_id !== $user->id) {
            abort(403);
        }

        $socialAccountCount = $user->socialAccounts()->count();

        if ($user->password === null && $socialAccountCount <= 1) {
            return response()->json([
                'message' => 'Set a password before disconnecting your only login method.',
            ], 422);
        }

        $socialAccount->delete();

        return response()->noContent();
    }
}
