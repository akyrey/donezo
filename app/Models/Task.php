<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\TaskObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

#[ObservedBy(TaskObserver::class)]
final class Task extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'project_id',
        'section_id',
        'heading_id',
        'title',
        'description',
        'status',
        'previous_status',
        'is_evening',
        'scheduled_at',
        'deadline_at',
        'completed_at',
        'cancelled_at',
        'repeat_rule',
        'position',
        'created_by',
        'assigned_to',
        'google_calendar_event_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_evening' => 'boolean',
            'scheduled_at' => 'datetime',
            'deadline_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'repeat_rule' => 'array',
        ];
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** @return BelongsTo<Section, $this> */
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    /** @return BelongsTo<Heading, $this> */
    public function heading(): BelongsTo
    {
        return $this->belongsTo(Heading::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return BelongsTo<User, $this> */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /** @return HasMany<ChecklistItem, $this> */
    public function checklistItems(): HasMany
    {
        return $this->hasMany(ChecklistItem::class);
    }

    /** @return HasMany<Reminder, $this> */
    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    /** @return BelongsToMany<Tag, $this> */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    /** @return BelongsToMany<Group, $this> */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class)->withTimestamps();
    }

    // ──────────────────────────────────────────────
    // Scopes — Status
    // ──────────────────────────────────────────────

    /** @param Builder<self> $query */
    public function scopeInbox(Builder $query): Builder
    {
        return $query->where('status', 'inbox');
    }

    /** @param Builder<self> $query */
    public function scopeToday(Builder $query): Builder
    {
        return $query->where('status', 'today');
    }

    /** @param Builder<self> $query */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('status', 'upcoming');
    }

    /** @param Builder<self> $query */
    public function scopeAnytime(Builder $query): Builder
    {
        return $query->where('status', 'anytime');
    }

    /** @param Builder<self> $query */
    public function scopeSomeday(Builder $query): Builder
    {
        return $query->where('status', 'someday');
    }

    /** @param Builder<self> $query */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', 'completed');
    }

    /** @param Builder<self> $query */
    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', 'cancelled');
    }

    // ──────────────────────────────────────────────
    // Scopes — Date / Time
    // ──────────────────────────────────────────────

    /** @param Builder<self> $query */
    public function scopeEvening(Builder $query): Builder
    {
        return $query->where('is_evening', true);
    }

    /** @param Builder<self> $query */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query->whereNotNull('deadline_at')
            ->where('deadline_at', '<', Carbon::now())
            ->whereNull('completed_at')
            ->whereNull('cancelled_at');
    }

    /** @param Builder<self> $query */
    public function scopeDueToday(Builder $query): Builder
    {
        return $query->whereNotNull('deadline_at')
            ->whereDate('deadline_at', Carbon::today())
            ->whereNull('completed_at')
            ->whereNull('cancelled_at');
    }
}
