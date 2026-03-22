<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/**
 * Private user channel — covers all personal resources:
 * tasks, projects, sections, headings, checklist items, reminders.
 * Allows multi-tab sync for the same user.
 */
Broadcast::channel('App.Models.User.{id}', function (User $user, int $id) {
    return $user->id === $id;
});

/**
 * Private group channel — covers shared tasks and group membership changes.
 * Allows real-time collaboration across all group members.
 */
Broadcast::channel('groups.{groupId}', function (User $user, int $groupId) {
    return $user->groups()->where('groups.id', $groupId)->exists()
        || $user->ownedGroups()->where('id', $groupId)->exists();
});
