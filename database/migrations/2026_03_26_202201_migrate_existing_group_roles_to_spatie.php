<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $groupUsers = DB::table('group_user')->get();

        foreach ($groupUsers as $pivot) {
            $user = \App\Models\User::find($pivot->user_id);
            if (! $user) {
                continue;
            }

            $role = in_array($pivot->role, ['admin', 'member', 'viewer'], true) ? $pivot->role : 'member';

            setPermissionsTeamId($pivot->group_id);
            $user->assignRole($role);
        }

        // Reset team context
        setPermissionsTeamId(null);
    }

    public function down(): void
    {
        // Remove all team-scoped role assignments
        DB::table('model_has_roles')
            ->whereNotNull('team_id')
            ->delete();
    }
};
