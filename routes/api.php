<?php

use App\Http\Controllers\Api\V1\CalendarController;
use App\Http\Controllers\Api\V1\TaskExportController;
use App\Http\Controllers\Api\V1\ChecklistItemController;
use App\Http\Controllers\Api\V1\GroupController;
use App\Http\Controllers\Api\V1\GroupInvitationController;
use App\Http\Controllers\Api\V1\HeadingController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\PushSubscriptionController;
use App\Http\Controllers\Api\V1\ReminderController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\SectionController;
use App\Http\Controllers\Api\V1\SocialAccountController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('v1')->name('api.v1.')->group(function () {
    // ──────────────────────────────────────────────
    // Search
    // ──────────────────────────────────────────────
    Route::get('search', SearchController::class)->name('search');

    // ──────────────────────────────────────────────
    // Exports (must be registered before apiResource
    // routes to avoid {task}/{project}/{group} captures)
    // ──────────────────────────────────────────────
    Route::post('tasks/export', [TaskExportController::class, 'exportAll'])->name('tasks.export');
    Route::get('exports/download', [TaskExportController::class, 'download'])->name('exports.download');

    // ──────────────────────────────────────────────
    // Tasks
    // ──────────────────────────────────────────────
    Route::apiResource('tasks', TaskController::class);
    Route::post('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::post('tasks/{task}/uncomplete', [TaskController::class, 'uncomplete'])->name('tasks.uncomplete');
    Route::post('tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');

    // ──────────────────────────────────────────────
    // Projects
    // ──────────────────────────────────────────────
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/export', [TaskExportController::class, 'exportProject'])->name('projects.export');

    // ──────────────────────────────────────────────
    // Sections
    // ──────────────────────────────────────────────
    Route::apiResource('sections', SectionController::class);

    // ──────────────────────────────────────────────
    // Tags
    // ──────────────────────────────────────────────
    Route::apiResource('tags', TagController::class);

    // ──────────────────────────────────────────────
    // Checklist Items (nested under tasks, shallow)
    // ──────────────────────────────────────────────
    Route::apiResource('tasks.checklist-items', ChecklistItemController::class)->shallow();
    Route::post('checklist-items/{checklistItem}/toggle', [ChecklistItemController::class, 'toggle'])
        ->name('checklist-items.toggle');

    // ──────────────────────────────────────────────
    // Reminders (nested under tasks, shallow)
    // ──────────────────────────────────────────────
    Route::apiResource('tasks.reminders', ReminderController::class)->shallow();

    // ──────────────────────────────────────────────
    // Headings (nested under projects, shallow)
    // ──────────────────────────────────────────────
    Route::apiResource('projects.headings', HeadingController::class)->shallow();
    Route::post('headings/reorder', [HeadingController::class, 'reorder'])->name('headings.reorder');

    // ──────────────────────────────────────────────
    // Groups
    // ──────────────────────────────────────────────
    Route::apiResource('groups', GroupController::class);
    Route::delete('groups/{group}/members/{user}', [GroupController::class, 'removeMember'])->name('groups.remove-member');
    Route::post('groups/{group}/tasks', [GroupController::class, 'shareTasks'])->name('groups.share-tasks');
    Route::post('groups/{group}/export', [TaskExportController::class, 'exportGroup'])->name('groups.export');

    // Group Invitations
    Route::get('groups/{group}/invitations', [GroupInvitationController::class, 'index'])->name('groups.invitations.index');
    Route::post('groups/{group}/invitations', [GroupInvitationController::class, 'store'])->name('groups.invitations.store');
    Route::delete('groups/{group}/invitations/{invitation}', [GroupInvitationController::class, 'destroy'])->name('groups.invitations.destroy');
    Route::post('invitations/{token}/accept', [GroupInvitationController::class, 'accept'])->name('invitations.accept');

    // ──────────────────────────────────────────────
    // Google Calendar
    // ──────────────────────────────────────────────
    Route::get('calendar/status', [CalendarController::class, 'status'])->name('calendar.status');
    Route::post('calendar/disconnect', [CalendarController::class, 'disconnect'])->name('calendar.disconnect');
    Route::post('calendar/sync', [CalendarController::class, 'sync'])->name('calendar.sync');

    // ──────────────────────────────────────────────
    // Push Subscriptions
    // ──────────────────────────────────────────────
    Route::post('push-subscriptions', [PushSubscriptionController::class, 'store'])->name('push-subscriptions.store');
    Route::delete('push-subscriptions', [PushSubscriptionController::class, 'destroy'])->name('push-subscriptions.destroy');
    Route::get('push-subscriptions/vapid-key', [PushSubscriptionController::class, 'vapidKey'])->name('push-subscriptions.vapid-key');

    // ──────────────────────────────────────────────
    // Social Accounts
    // ──────────────────────────────────────────────
    Route::delete('social-accounts/{socialAccount}', [SocialAccountController::class, 'destroy'])->name('social-accounts.destroy');
});
