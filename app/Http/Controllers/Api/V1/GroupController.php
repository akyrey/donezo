<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Data\GroupData;
use App\Data\TaskData;
use App\Data\UserData;
use App\Events\GroupDeleted;
use App\Events\GroupMemberRemoved;
use App\Events\GroupTasksShared;
use App\Events\GroupUpdated;
use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class GroupController extends Controller
{
    /**
     * List groups the authenticated user belongs to or owns.
     */
    public function index(Request $request): JsonResponse
    {
        $groups = $request->user()
            ->groups()
            ->with('owner')
            ->withCount('members as member_count')
            ->get()
            ->merge(
                $request->user()
                    ->ownedGroups()
                    ->with('owner')
                    ->withCount('members as member_count')
                    ->get()
            )
            ->unique('id')
            ->values();

        return response()->json([
            'data' => GroupData::collect($groups),
        ]);
    }

    /**
     * Create a new group.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ]);

        $group = Group::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'owner_id' => $request->user()->id,
        ]);

        // Add the creator as a member with admin role (also assigns spatie role)
        $group->addMember($request->user(), 'admin');

        $group->load('owner');
        $group->loadCount('members as member_count');

        return response()->json([
            'data' => GroupData::from($group),
        ], 201);
    }

    /**
     * Get a single group.
     */
    public function show(Request $request, Group $group): JsonResponse
    {
        $this->authorizeGroupAccess($request, $group);

        $group->load(['owner', 'members']);
        $group->loadCount('members as member_count');

        return response()->json([
            'data' => GroupData::from($group),
            'members' => UserData::collect($group->members),
        ]);
    }

    /**
     * Update a group.
     */
    public function update(Request $request, Group $group): JsonResponse
    {
        $this->authorizeGroupPermission($request, $group, 'group.update');

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ]);

        $group->update($validated);

        $group->load('owner');
        $group->loadCount('members as member_count');

        broadcast(new GroupUpdated($group))->toOthers();

        return response()->json([
            'data' => GroupData::from($group),
        ]);
    }

    /**
     * Soft delete a group (owner only).
     */
    public function destroy(Request $request, Group $group): JsonResponse
    {
        abort_unless($group->owner_id === $request->user()->id, 403);

        // Capture member IDs before detaching so we can notify them
        $memberIds = $group->members()->pluck('users.id')->toArray();
        $groupId = $group->id;

        // Remove all spatie role assignments for this group
        setPermissionsTeamId($group->id);
        foreach ($group->members as $member) {
            $member->syncRoles([]);
        }
        setPermissionsTeamId(null);

        $group->members()->detach();
        $group->tasks()->detach();
        $group->delete();

        broadcast(new GroupDeleted($groupId, $memberIds))->toOthers();

        return response()->json(null, 204);
    }

    /**
     * Remove a member from a group.
     */
    public function removeMember(Request $request, Group $group, User $user): JsonResponse
    {
        $this->authorizeGroupPermission($request, $group, 'group.manage-members');

        if ($user->id === $group->owner_id) {
            return response()->json(['message' => 'Cannot remove the group owner.'], 422);
        }

        $group->members()->detach($user->id);

        // Remove spatie roles scoped to this group
        setPermissionsTeamId($group->id);
        $user->syncRoles([]);
        setPermissionsTeamId(null);

        $group->load('owner');
        $group->loadCount('members as member_count');

        broadcast(new GroupMemberRemoved($group->id, $user->id))->toOthers();

        return response()->json([
            'data' => GroupData::from($group),
        ]);
    }

    /**
     * Update a member's role in the group.
     */
    public function updateMemberRole(Request $request, Group $group, User $user): JsonResponse
    {
        $this->authorizeGroupPermission($request, $group, 'group.manage-members');

        if ($user->id === $group->owner_id) {
            return response()->json(['message' => 'Cannot change the role of the group owner.'], 422);
        }

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,member,viewer'],
        ]);

        // Update the group_user pivot role
        $group->members()->updateExistingPivot($user->id, ['role' => $validated['role']]);

        // Update spatie role scoped to this group
        setPermissionsTeamId($group->id);
        $user->syncRoles([$validated['role']]);
        setPermissionsTeamId(null);

        return response()->json([
            'message' => 'Member role updated successfully.',
        ]);
    }

    /**
     * Share tasks with a group.
     */
    public function shareTasks(Request $request, Group $group): JsonResponse
    {
        $this->authorizeGroupPermission($request, $group, 'group.share-tasks');

        $validated = $request->validate([
            'task_ids' => ['required', 'array'],
            'task_ids.*' => ['integer', 'exists:tasks,id'],
        ]);

        // Ensure user owns all the tasks being shared
        $userTaskIds = $request->user()
            ->tasks()
            ->whereIn('id', $validated['task_ids'])
            ->pluck('id');

        $group->tasks()->syncWithoutDetaching($userTaskIds);

        $tasks = $group->tasks()
            ->whereIn('tasks.id', $userTaskIds)
            ->with(['tags', 'checklistItems', 'reminders'])
            ->get();

        broadcast(new GroupTasksShared($group->id))->toOthers();

        return response()->json([
            'data' => TaskData::collect($tasks),
        ]);
    }

    /**
     * Ensure the user has access to the group (any member or owner).
     */
    private function authorizeGroupAccess(Request $request, Group $group): void
    {
        $userId = $request->user()->id;
        $isMember = $group->members()->where('user_id', $userId)->exists();
        $isOwner = $group->owner_id === $userId;

        abort_unless($isMember || $isOwner, 403);
    }

    /**
     * Ensure the user has a specific spatie permission in this group's team context.
     */
    private function authorizeGroupPermission(Request $request, Group $group, string $permission): void
    {
        $this->authorizeGroupAccess($request, $group);

        setPermissionsTeamId($group->id);
        $hasPermission = $request->user()->hasPermissionTo($permission);
        setPermissionsTeamId(null);

        abort_unless($hasPermission, 403);
    }
}
