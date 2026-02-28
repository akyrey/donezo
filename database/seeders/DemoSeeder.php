<?php

namespace Database\Seeders;

use App\Models\ChecklistItem;
use App\Models\Heading;
use App\Models\Project;
use App\Models\Reminder;
use App\Models\Section;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DemoSeeder extends Seeder
{
    /**
     * Create demo data for local development.
     */
    public function run(): void
    {
        // ── Demo User ──────────────────────────────────
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@donezo.app',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // ── Sections ───────────────────────────────────
        $personal = Section::create([
            'user_id' => $user->id,
            'name' => 'Personal',
            'position' => 0,
        ]);

        $work = Section::create([
            'user_id' => $user->id,
            'name' => 'Work',
            'position' => 1,
        ]);

        // ── Projects ───────────────────────────────────
        $homeReno = Project::create([
            'user_id' => $user->id,
            'section_id' => $personal->id,
            'name' => 'Home Renovation',
            'description' => 'Kitchen and bathroom remodel project',
            'status' => 'active',
            'position' => 0,
        ]);

        $q1Planning = Project::create([
            'user_id' => $user->id,
            'section_id' => $work->id,
            'name' => 'Q1 Planning',
            'description' => 'First quarter goals and OKRs',
            'status' => 'active',
            'position' => 0,
        ]);

        $sideProject = Project::create([
            'user_id' => $user->id,
            'section_id' => $personal->id,
            'name' => 'Side Project',
            'description' => 'Weekend coding project — habit tracker app',
            'status' => 'active',
            'position' => 1,
        ]);

        // ── Headings ───────────────────────────────────
        $renoPlanning = Heading::create(['project_id' => $homeReno->id, 'name' => 'Planning', 'position' => 0]);
        $renoExecution = Heading::create(['project_id' => $homeReno->id, 'name' => 'Execution', 'position' => 1]);

        $q1Goals = Heading::create(['project_id' => $q1Planning->id, 'name' => 'Goals', 'position' => 0]);
        $q1Meetings = Heading::create(['project_id' => $q1Planning->id, 'name' => 'Meetings', 'position' => 1]);

        $spDesign = Heading::create(['project_id' => $sideProject->id, 'name' => 'Design', 'position' => 0]);
        $spDev = Heading::create(['project_id' => $sideProject->id, 'name' => 'Development', 'position' => 1]);

        // ── Tags ───────────────────────────────────────
        $tagUrgent = Tag::create(['user_id' => $user->id, 'name' => 'urgent', 'color' => '#ef4444']);
        $tagEmail = Tag::create(['user_id' => $user->id, 'name' => 'email', 'color' => '#3b82f6']);
        $tagMeeting = Tag::create(['user_id' => $user->id, 'name' => 'meeting', 'color' => '#a855f7']);
        $tagErrand = Tag::create(['user_id' => $user->id, 'name' => 'errand', 'color' => '#f97316']);

        // ── Tasks ──────────────────────────────────────
        $taskData = [
            // Inbox tasks
            ['title' => 'Review insurance renewal documents', 'status' => 'inbox', 'position' => 0],
            ['title' => 'Look into new podcast recommendations', 'status' => 'inbox', 'position' => 1],
            ['title' => 'Research standing desk options', 'status' => 'inbox', 'position' => 2],

            // Today tasks
            ['title' => 'Reply to contractor email about kitchen tiles', 'status' => 'today', 'position' => 0, 'project_id' => $homeReno->id, 'heading_id' => $renoPlanning->id],
            ['title' => 'Prepare slides for Monday standup', 'status' => 'today', 'position' => 1, 'project_id' => $q1Planning->id, 'heading_id' => $q1Meetings->id],
            ['title' => 'Buy groceries for the week', 'status' => 'today', 'position' => 2, 'is_evening' => true],
            ['title' => 'Call plumber for bathroom estimate', 'status' => 'today', 'position' => 3, 'project_id' => $homeReno->id, 'heading_id' => $renoPlanning->id, 'deadline_at' => Carbon::now()->addDays(2)],

            // Upcoming tasks
            ['title' => 'Schedule team retrospective', 'status' => 'upcoming', 'position' => 0, 'project_id' => $q1Planning->id, 'heading_id' => $q1Meetings->id, 'scheduled_at' => Carbon::now()->addDays(3)],
            ['title' => 'Dentist appointment', 'status' => 'upcoming', 'position' => 1, 'scheduled_at' => Carbon::now()->addWeek()],
            ['title' => 'Submit expense report', 'status' => 'upcoming', 'position' => 2, 'scheduled_at' => Carbon::now()->addDays(5), 'deadline_at' => Carbon::now()->addDays(7)],

            // Anytime tasks
            ['title' => 'Set up CI/CD pipeline', 'status' => 'anytime', 'position' => 0, 'project_id' => $sideProject->id, 'heading_id' => $spDev->id],
            ['title' => 'Design app logo', 'status' => 'anytime', 'position' => 1, 'project_id' => $sideProject->id, 'heading_id' => $spDesign->id],
            ['title' => 'Write Q1 OKR draft', 'status' => 'anytime', 'position' => 2, 'project_id' => $q1Planning->id, 'heading_id' => $q1Goals->id],
            ['title' => 'Organize garage storage', 'status' => 'anytime', 'position' => 3],

            // Someday tasks
            ['title' => 'Learn watercolor painting', 'status' => 'someday', 'position' => 0],
            ['title' => 'Plan summer vacation itinerary', 'status' => 'someday', 'position' => 1],

            // Completed tasks
            ['title' => 'Finalize budget for renovation', 'status' => 'completed', 'position' => 0, 'project_id' => $homeReno->id, 'heading_id' => $renoPlanning->id, 'completed_at' => Carbon::now()->subDays(3)],
            ['title' => 'Set up project repository', 'status' => 'completed', 'position' => 1, 'project_id' => $sideProject->id, 'heading_id' => $spDev->id, 'completed_at' => Carbon::now()->subDays(5)],
            ['title' => 'Send onboarding docs to new hire', 'status' => 'completed', 'position' => 2, 'project_id' => $q1Planning->id, 'completed_at' => Carbon::now()->subDay()],
        ];

        $tasks = [];
        foreach ($taskData as $data) {
            $tasks[] = Task::create(array_merge([
                'user_id' => $user->id,
                'created_by' => $user->id,
                'project_id' => null,
                'section_id' => null,
                'heading_id' => null,
                'description' => null,
                'is_evening' => false,
                'scheduled_at' => null,
                'deadline_at' => null,
                'completed_at' => null,
                'cancelled_at' => null,
            ], $data));
        }

        // ── Tag assignments ────────────────────────────
        // "Reply to contractor email..." → urgent, email
        $tasks[3]->tags()->attach([$tagUrgent->id, $tagEmail->id]);
        // "Prepare slides..." → meeting
        $tasks[4]->tags()->attach([$tagMeeting->id]);
        // "Buy groceries..." → errand
        $tasks[5]->tags()->attach([$tagErrand->id]);
        // "Call plumber..." → urgent, errand
        $tasks[6]->tags()->attach([$tagUrgent->id, $tagErrand->id]);
        // "Schedule team retrospective" → meeting
        $tasks[7]->tags()->attach([$tagMeeting->id]);
        // "Submit expense report" → urgent
        $tasks[9]->tags()->attach([$tagUrgent->id]);

        // ── Checklist items ────────────────────────────
        // "Buy groceries for the week"
        ChecklistItem::create(['task_id' => $tasks[5]->id, 'title' => 'Vegetables & fruits', 'is_completed' => false, 'position' => 0]);
        ChecklistItem::create(['task_id' => $tasks[5]->id, 'title' => 'Chicken & fish', 'is_completed' => false, 'position' => 1]);
        ChecklistItem::create(['task_id' => $tasks[5]->id, 'title' => 'Bread & dairy', 'is_completed' => true, 'position' => 2]);
        ChecklistItem::create(['task_id' => $tasks[5]->id, 'title' => 'Snacks for the kids', 'is_completed' => false, 'position' => 3]);

        // "Prepare slides for Monday standup"
        ChecklistItem::create(['task_id' => $tasks[4]->id, 'title' => 'Add sprint metrics', 'is_completed' => true, 'position' => 0]);
        ChecklistItem::create(['task_id' => $tasks[4]->id, 'title' => 'Include blocker summary', 'is_completed' => false, 'position' => 1]);
        ChecklistItem::create(['task_id' => $tasks[4]->id, 'title' => 'Update roadmap slide', 'is_completed' => false, 'position' => 2]);

        // "Set up CI/CD pipeline"
        ChecklistItem::create(['task_id' => $tasks[10]->id, 'title' => 'Configure GitHub Actions', 'is_completed' => false, 'position' => 0]);
        ChecklistItem::create(['task_id' => $tasks[10]->id, 'title' => 'Add test stage', 'is_completed' => false, 'position' => 1]);
        ChecklistItem::create(['task_id' => $tasks[10]->id, 'title' => 'Set up deployment to staging', 'is_completed' => false, 'position' => 2]);

        // ── Reminders ──────────────────────────────────
        // "Call plumber for bathroom estimate" — remind tomorrow morning
        Reminder::create([
            'task_id' => $tasks[6]->id,
            'remind_at' => Carbon::tomorrow()->setHour(9),
            'is_sent' => false,
        ]);

        // "Submit expense report" — remind in 4 days
        Reminder::create([
            'task_id' => $tasks[9]->id,
            'remind_at' => Carbon::now()->addDays(4)->setHour(10),
            'is_sent' => false,
        ]);

        // "Dentist appointment" — remind day before
        Reminder::create([
            'task_id' => $tasks[8]->id,
            'remind_at' => Carbon::now()->addDays(6)->setHour(18),
            'is_sent' => false,
        ]);
    }
}
