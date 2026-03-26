<?php

declare(strict_types=1);

use Database\Seeders\GroupRolesAndPermissionsSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        (new GroupRolesAndPermissionsSeeder())->run();
    }

    public function down(): void
    {
        \Spatie\Permission\Models\Role::whereIn('name', ['admin', 'member', 'viewer'])->delete();
        \Spatie\Permission\Models\Permission::whereIn('name', [
            'group.update',
            'group.manage-members',
            'group.view-tasks',
            'group.manage-tasks',
            'group.share-tasks',
        ])->delete();
    }
};
