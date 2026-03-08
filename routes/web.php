<?php

use App\Http\Controllers\Api\V1\CalendarController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Web\AnytimeController;
use App\Http\Controllers\Web\GroupInvitationController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\GroupController;
use App\Http\Controllers\Web\InboxController;
use App\Http\Controllers\Web\LogbookController;
use App\Http\Controllers\Web\ProjectController;
use App\Http\Controllers\Web\SectionController;
use App\Http\Controllers\Web\SettingsController;
use App\Http\Controllers\Web\SomedayController;
use App\Http\Controllers\Web\TodayController;
use App\Http\Controllers\Web\UpcomingController;
use Illuminate\Support\Facades\Route;

// ──────────────────────────────────────────────
// Guest routes
// ──────────────────────────────────────────────

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])->name('social.redirect');
    Route::get('auth/{provider}/callback', [SocialAuthController::class, 'callback'])->name('social.callback');
});

// ──────────────────────────────────────────────
// Authenticated routes
// ──────────────────────────────────────────────

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/inbox', [InboxController::class, 'index'])->name('inbox');
    Route::get('/today', [TodayController::class, 'index'])->name('today');
    Route::get('/upcoming', [UpcomingController::class, 'index'])->name('upcoming');
    Route::get('/anytime', [AnytimeController::class, 'index'])->name('anytime');
    Route::get('/someday', [SomedayController::class, 'index'])->name('someday');
    Route::get('/logbook', [LogbookController::class, 'index'])->name('logbook');

    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::get('/sections/{section}', [SectionController::class, 'show'])->name('sections.show');

    Route::resource('groups', GroupController::class)->only(['index', 'show']);

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

    Route::get('/invitations/{token}', [GroupInvitationController::class, 'show'])->name('invitations.accept');

    Route::patch('/profile', [SettingsController::class, 'updateProfile'])->name('profile.update');
    Route::patch('/profile/preferences', [SettingsController::class, 'updatePreferences'])->name('profile.preferences');
    Route::put('/profile/password', [SettingsController::class, 'updatePassword'])->name('password.update');
    Route::delete('/profile', [SettingsController::class, 'destroy'])->name('profile.destroy');

    // ──────────────────────────────────────────────
    // Google Calendar OAuth (requires auth — connects calendar post-login)
    // ──────────────────────────────────────────────
    Route::get('/auth/google/calendar/redirect', [CalendarController::class, 'connect'])->name('calendar.connect');
    Route::get('/auth/google/calendar/callback', [CalendarController::class, 'callback'])->name('calendar.callback');
});
