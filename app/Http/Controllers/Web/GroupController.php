<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Data\GroupData;
use App\Data\TaskData;
use App\Data\UserData;
use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class GroupController extends Controller
{
    /**
     * Display a listing of the user's groups (owned + member of).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $groups = $user
            ->groups()
            ->with('owner')
            ->withCount('members as member_count')
            ->get()
            ->merge(
                $user->ownedGroups()
                    ->with('owner')
                    ->withCount('members as member_count')
                    ->get()
            )
            ->unique('id')
            ->values();

        return Inertia::render('Groups/Index', [
            'groups' => GroupData::collect($groups),
        ]);
    }

    /**
     * Display a specific group with its members and shared tasks.
     */
    public function show(Request $request, Group $group): Response
    {
        $this->authorizeGroupAccess($request, $group);

        $user = $request->user();

        $group->load(['owner', 'members']);
        $group->loadCount('members as member_count');

        $tasks = $group->tasks()
            ->whereNull('completed_at')
            ->whereNull('cancelled_at')
            ->orderBy('updated_at', 'desc')
            ->with(['tags', 'checklistItems', 'reminders', 'assignee', 'creator'])
            ->get();

        // Resolve the current user's role in this group via spatie
        setPermissionsTeamId($group->id);
        $currentUserRole = $user->getRoleNames()->first() ?? 'viewer';
        setPermissionsTeamId(null);

        return Inertia::render('Groups/Show', [
            'group' => array_merge(GroupData::from($group)->toArray(), [
                'current_user_role' => $currentUserRole,
            ]),
            'members' => UserData::collect($group->members),
            'tasks' => TaskData::collect($tasks),
        ]);
    }

    /**
     * Ensure the user has access to the group.
     */
    private function authorizeGroupAccess(Request $request, Group $group): void
    {
        $userId = $request->user()->id;
        $isMember = $group->members()->where('user_id', $userId)->exists();
        $isOwner = $group->owner_id === $userId;

        abort_unless($isMember || $isOwner, 403);
    }
}
