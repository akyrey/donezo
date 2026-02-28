<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add token expiry and scopes tracking to social_accounts
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->timestamp('token_expires_at')->nullable()->after('provider_refresh_token');
            $table->json('scopes')->nullable()->after('token_expires_at');
        });

        // Add Google Calendar event ID to tasks for sync tracking
        Schema::table('tasks', function (Blueprint $table) {
            $table->string('google_calendar_event_id')->nullable()->after('assigned_to');
            $table->index('google_calendar_event_id');
        });

        // Push notification subscriptions (Web Push / VAPID)
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('endpoint')->unique();
            $table->string('p256dh_key')->nullable();
            $table->string('auth_token')->nullable();
            $table->string('content_encoding')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('push_subscriptions');

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['google_calendar_event_id']);
            $table->dropColumn('google_calendar_event_id');
        });

        Schema::table('social_accounts', function (Blueprint $table) {
            $table->dropColumn(['token_expires_at', 'scopes']);
        });
    }
};
