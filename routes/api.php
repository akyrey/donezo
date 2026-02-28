<?php

use App\Http\Controllers\Api\V1\ChecklistItemController;
use App\Http\Controllers\Api\V1\GroupController;
use App\Http\Controllers\Api\V1\HeadingController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ReminderController;
use App\Http\Controllers\Api\V1\SectionController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('v1')->name('api.v1.')->group(function () {
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
    Route::post('groups/{group}/members', [GroupController::class, 'addMember'])->name('groups.add-member');
    Route::delete('groups/{group}/members/{user}', [GroupController::class, 'removeMember'])->name('groups.remove-member');
    Route::post('groups/{group}/tasks', [GroupController::class, 'shareTasks'])->name('groups.share-tasks');
});
