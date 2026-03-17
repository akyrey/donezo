<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Data\GroupData;
use App\Data\TaskData;
use App\Data\UserData;
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

        // Add the creator as a member with admin role
        $group->members()->attach($request->user()->id, ['role' => 'admin']);

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
        abort_unless($group->owner_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ]);

        $group->update($validated);

        $group->load('owner');
        $group->loadCount('members as member_count');

        return response()->json([
            'data' => GroupData::from($group),
        ]);
    }

    /**
     * Soft delete a group.
     */
    public function destroy(Request $request, Group $group): JsonResponse
    {
        abort_unless($group->owner_id === $request->user()->id, 403);

        $group->members()->detach();
        $group->tasks()->detach();
        $group->delete();

        return response()->json(null, 204);
    }

    /**
     * Remove a member from a group.
     */
    public function removeMember(Request $request, Group $group, User $user): JsonResponse
    {
        abort_unless($group->owner_id === $request->user()->id, 403);

        if ($user->id === $group->owner_id) {
            return response()->json(['message' => 'Cannot remove the group owner.'], 422);
        }

        $group->members()->detach($user->id);

        $group->load('owner');
        $group->loadCount('members as member_count');

        return response()->json([
            'data' => GroupData::from($group),
        ]);
    }

    /**
     * Share tasks with a group.
     */
    public function shareTasks(Request $request, Group $group): JsonResponse
    {
        $this->authorizeGroupAccess($request, $group);

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

        return response()->json([
            'data' => TaskData::collect($tasks),
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
