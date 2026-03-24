# Donezo -- Project Context for AI Assistants

> **What is this file?** Point an AI assistant here at the start of a session so it can understand the full codebase without re-exploring.

## Run Environment

All commands (composer, artisan, npm, npx, php) must be run through **Docker Compose**:

```bash
docker compose exec donezo.ws npm ...
docker compose exec donezo.ws npx tsc --noEmit
docker compose exec donezo.ws php artisan ...
docker compose exec donezo.ws composer ...
```

---

## 1. Overview

Donezo is a Things-inspired (https://culturedcode.com/things/) task management app. Full-stack: Laravel 12 + Inertia.js + React 19 + TypeScript. Features: tasks with statuses (inbox/today/upcoming/anytime/someday), projects, sections, headings, tags, checklists, reminders, Google Calendar sync, groups/collaboration, and Web Push notifications.

---

## 2. Tech Stack

### Backend

- PHP 8.5, Laravel 12, Inertia.js 2, Sanctum 4, Socialite 5
- Spatie LaravelData 4 (DTOs for request validation + response shaping)
- Google API Client 2.19 (Calendar sync), minishlink/web-push 10 (Push notifications)
- Database: PostgreSQL (via Sail), Redis for queues/cache

### Frontend

- React 19, TypeScript 5.9, Vite 7
- @tanstack/react-query 5 (data fetching + mutations)
- @dnd-kit/core 6 + @dnd-kit/utilities 3 (drag-and-drop)
- Tailwind CSS 4 (via @tailwindcss/vite, NOT PostCSS)
- Radix UI (dialog, dropdown, checkbox, popover, scroll-area, tooltip, etc.)
- lucide-react (icons), date-fns, class-variance-authority, react-markdown + remark-gfm
- ziggy-js (Laravel named routes in JS via `route()`)

### Build

- `composer dev` runs concurrently: `php artisan serve`, `php artisan queue:listen`, `php artisan pail`, `npm run dev`
- TypeScript check: `docker compose exec donezo.ws npx tsc --noEmit`
- Docker image build accepts `--build-arg VITE_REVERB_APP_KEY=<key>` to bake the Reverb key into the JS bundle at build time; omitting it disables real-time broadcasting gracefully

---

## 3. Directory Structure

```
app/
  Console/Commands/           # ProcessDueReminders
  Data/                       # Spatie LaravelData DTOs (Create/Update + output DTOs)
  Http/Controllers/
    Api/V1/                   # REST API controllers (JSON)
    Auth/                     # Login, Register, Social OAuth
    Web/                      # Inertia page controllers (server-render)
  Jobs/                       # SyncTaskToCalendar, RemoveCalendarEvent
  Mail/                       # GroupInvitationMail
  Models/                     # User, Task, Project, Section, Heading, Tag, ChecklistItem, Reminder, Group, GroupInvitation, PushSubscription, SocialAccount
  Notifications/              # ReminderDueNotification
  Services/                   # GoogleCalendarService

resources/js/
  app.tsx                     # Inertia + React Query setup
  components/
    CommandPalette.tsx         # Cmd+K global search/navigation
    tasks/
      AddTaskDialog.tsx        # Modal for creating tasks (wraps TaskForm in full mode)
      TaskForm.tsx             # Create/edit form (inline compact or full mode)
      TaskList.tsx             # Renders list of TaskItems
      TaskItem.tsx             # Single task row with checkbox, metadata, quick actions
      TaskDetail.tsx           # Read-only task detail view
      TaskDetailDialog.tsx     # View/edit dialog for existing tasks
      MarkdownContent.tsx      # Renders Markdown
    ui/                        # Badge, Button, Checkbox, Dialog, DropdownMenu, Input, Popover, ScrollArea, Separator, Tooltip, UndoToast
  hooks/
    useTasks.ts                # Task CRUD + complete/uncomplete/reorder/toggle-checklist
    useProjects.ts             # Project CRUD
    useSections.ts             # Section CRUD
    useTags.ts                 # Tag CRUD
    useSearch.ts               # Debounced search across tasks/projects/sections/tags
    useGroups.ts               # Group CRUD, invitations (invite/cancel/accept), member removal
    useCalendar.ts             # Google Calendar status/disconnect/sync
    useNotifications.ts        # Web Push subscribe/unsubscribe
    useSocialAccounts.ts       # Social account disconnect
  layouts/
    AuthenticatedLayout.tsx    # Main shell: sidebar, DnD FAB, CommandPalette, AddTaskDialog
    GuestLayout.tsx            # Auth pages
  pages/                       # Inertia pages (see section 7)
  types/index.d.ts             # All TypeScript types
  lib/utils.ts                 # cn() = clsx + tailwind-merge

routes/
  api.php                      # REST API (Sanctum-guarded, /api/v1/...)
  web.php                      # Inertia pages + auth
```

---

## 4. Database Models & Relationships

### User

- hasMany: sections, projects, tasks, tags, pushSubscriptions, socialAccounts, ownedGroups
- belongsToMany: groups (pivot: role)

### Task

- SoftDeletes
- Fields: user_id, project_id?, section_id?, heading_id?, title, description?, status (inbox|today|upcoming|anytime|someday|completed|cancelled), previous_status, is_evening, scheduled_at?, deadline_at?, completed_at?, cancelled_at?, repeat_rule?, position, created_by?, assigned_to?, google_calendar_event_id?
- belongsTo: user, project?, section?, heading?, creator?, assignee?
- hasMany: checklistItems, reminders
- belongsToMany: tags, groups
- Scopes: inbox, today, upcoming, anytime, someday, completed, cancelled, evening, overdue, dueToday

### Project (SoftDeletes)

- Fields: user_id, section_id?, name, description?, status (active|completed|archived), position, completed_at?
- belongsTo: user, section?; hasMany: tasks, headings

### Section (SoftDeletes)

- Fields: user_id, name, position
- belongsTo: user; hasMany: projects, tasks

### Heading

- Fields: project_id, name, position, archived_at?
- belongsTo: project; hasMany: tasks

### Tag

- Fields: user_id, name, color?
- belongsTo: user; belongsToMany: tasks

### ChecklistItem

- Fields: task_id, title, is_completed, position

### Reminder

- Fields: task_id, remind_at, is_sent

### Group (SoftDeletes)

- Fields: name, description?, owner_id
- belongsTo: owner; belongsToMany: members (pivot: role), tasks; hasMany: invitations

### GroupInvitation

- Fields: group_id, invited_by, email, token (64-char unique), role (default 'member'), accepted_at?, expires_at (7-day TTL)
- Unique constraint on (group_id, email) — only one pending invite per email+group
- belongsTo: group, inviter (User via invited_by)
- Helpers: isPending(), isExpired(), isAccepted()

### PushSubscription

- Fields: user_id, endpoint, p256dh_key, auth_token, content_encoding

### SocialAccount

- Fields: user_id, provider, provider_id, provider_token, provider_refresh_token, token_expires_at, scopes
- belongsTo: user
- Hidden fields: provider_token, provider_refresh_token
- Casts: token_expires_at (datetime), scopes (array)
- Helpers: isTokenExpired(), hasScope(string $scope), hasCalendarAccess()

---

## 5. Routes

### Web Routes (Inertia, `auth` middleware)

Heading creation and deletion use dedicated web routes so that Inertia's `useForm` can POST/DELETE and receive a redirect response:

```
POST   /projects/{project}/headings   projects.headings.store   Web\HeadingController@store
DELETE /headings/{heading}            headings.destroy          Web\HeadingController@destroy
```

Both unassign child tasks (`heading_id = null`) before deleting and redirect back to `projects.show`.

### API Routes

All under `auth:sanctum`, prefix `/api/v1/`:

```
# Tasks
GET/POST       /tasks
GET/PUT/DELETE /tasks/{task}
POST           /tasks/{task}/complete
POST           /tasks/{task}/uncomplete
POST           /tasks/reorder

# Checklist Items (nested under tasks, shallow)
POST           /tasks/{task}/checklist-items
GET/PUT/DELETE /checklist-items/{item}
POST           /checklist-items/{item}/toggle

# Reminders (nested under tasks, shallow)
POST           /tasks/{task}/reminders
GET/PUT/DELETE /reminders/{reminder}

# Projects
GET/POST       /projects
GET/PUT/DELETE /projects/{project}

# Headings (nested under projects, shallow)
GET/POST       /projects/{project}/headings
GET/PUT/DELETE /headings/{heading}
POST           /headings/reorder

# Sections
GET/POST       /sections
GET/PUT/DELETE /sections/{section}

# Tags
GET/POST       /tags
GET/PUT/DELETE /tags/{tag}

# Groups
GET/POST       /groups
GET/PUT/DELETE /groups/{group}
DELETE         /groups/{group}/members/{user}
POST           /groups/{group}/tasks

# Group Invitations
GET/POST       /groups/{group}/invitations
DELETE         /groups/{group}/invitations/{invitation}
POST           /invitations/{token}/accept

# Search
GET            /search?q={query}&limit=10

# Calendar
GET            /calendar/status
POST           /calendar/disconnect
POST           /calendar/sync

# Push Subscriptions
POST           /push-subscriptions
DELETE         /push-subscriptions
GET            /push-subscriptions/vapid-key

# Connected Accounts (Social)
DELETE         /social-accounts/{socialAccount}
```

---

## 6. Inertia Shared Data (every authenticated page)

Via `HandleInertiaRequests` middleware:

- `auth.user` -- UserData DTO
- `projects` -- Active ProjectData[] ordered by position (with task_count, completed_task_count)
- `sections` -- SectionData[] ordered by position
- `groups` -- GroupData[] (owned + member-of, deduplicated)
- `flash.success`, `flash.error`
- `ziggy` -- route data

---

## 7. Pages & Their Props

| Page                    | Props                                                                                                               | Layout Props                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Inbox                   | `{ tasks: Task[] }`                                                                                                 | `taskContext="inbox"`                                 |
| Today                   | `{ morning_tasks, evening_tasks, overdue_tasks: Task[] }`                                                           | `taskContext="today"`                                 |
| Upcoming                | `{ grouped_tasks: Record<string, Task[]>, start_date? }`                                                            | `taskContext="upcoming"`                              |
| Anytime                 | `{ tasks: Task[] }`                                                                                                 | `taskContext="anytime"`                               |
| Someday                 | `{ tasks: Task[] }`                                                                                                 | `taskContext="someday"`                               |
| Logbook                 | `{ tasks: Paginated<Task> }`                                                                                        | (none)                                                |
| Projects/Index          | `{ projects: Project[], openDialog? }`                                                                              | (none)                                                |
| Projects/Show           | `{ project, tasks, headings }`                                                                                      | `taskContext="project" defaultProjectId={project.id}` |
| Sections/Show           | `{ section, projects, tasks }`                                                                                      | (none)                                                |
| Groups/Index            | `{ groups: Group[] }`                                                                                               | (none)                                                |
| Groups/Show             | `{ group, members, tasks }`                                                                                         | (none)                                                |
| Groups/AcceptInvitation | `{ invitation: { token, email, role, expired, group, inviter, expires_at } }`                                       | (none, GuestLayout)                                   |
| Settings/Index          | `{ calendarStatus, hasGoogleAccount, hasPushSubscriptions, socialAccounts: SocialAccount[], hasPassword: boolean }` | (none)                                                |

---

## 8. Layout Architecture (AuthenticatedLayout)

Wraps everything in `DndContext` (@dnd-kit).

**Sidebar** (left, 256px, mobile drawer):

- Nav items (Inbox, Today, Upcoming, Anytime, Someday, Logbook) -- each is a droppable target
- Projects list -- each is a droppable target
- Sections list -- each is a droppable target
- Groups list (not droppable)
- User menu (Settings, Logout)

**Main area**:

- Top bar: hamburger (mobile), page title, Quick Find button (opens CommandPalette)
- Content: `children` inside `max-w-3xl`, `pb-24` for FAB clearance

**FAB** (fixed bottom-right, all screen sizes):

- **Tap** (click): opens AddTaskDialog with page-level `taskContext`/`defaultProjectId`
- **Drag** (8px activation distance): starts DnD, auto-opens sidebar on mobile, shows ghost overlay. Drop on nav item sets that status context, drop on project sets that project. Opens AddTaskDialog with resolved context.

**Drop target highlighting**: blue ring + `bg-primary/10` tint when FAB hovers over a droppable sidebar item.

---

## 9. TaskForm Modes

**`inline` prop = true**: Compact UI -- borderless title input + "Add notes" toggle. Used nowhere currently (was for old inline quick-add bars, now removed).

**`inline` prop = false (default)**: Full form -- title, description textarea, scheduled/deadline dates, evening checkbox, project/section selects, tag chips, checklist builder, reminders list. Submit button shows "Add Task" or "Update Task".

**`context` prop**: Sets default status via `getDefaultStatus()`. Does NOT affect UI mode (decoupled from `inline`).

---

## 10. Key Patterns

### Data Flow

- Server-rendered pages via Inertia (Web controllers query + DTO transform + `Inertia::render()`)
- Client-side mutations via React Query + Axios (hit API v1, invalidate caches, AND `router.reload()` to re-sync Inertia page props)

### Task Completion with Undo

1. Checkbox click triggers `animate-task-complete` CSS animation
2. After 350ms, fires `useCompleteTaskMutation`
3. On success, dispatches `CustomEvent('task-completed')` on `window`
4. Layout shows `UndoToast` (auto-dismiss 4s with progress bar)
5. Undo calls uncomplete mutation (restores `previous_status`)

### Group Invitation Flow

1. Owner opens the "Invite Member" dialog on Groups/Show and submits an email
2. `POST /api/v1/groups/{group}/invitations` creates a `GroupInvitation` (7-day TTL, unique token) and queues `GroupInvitationMail`
   - **Existing user**: email contains a direct accept link → `GET /invitations/{token}` (Inertia page) → user clicks "Accept" → `POST /api/v1/invitations/{token}/accept`
   - **New user**: email contains a registration link → `/register?invitation={token}` → email pre-filled and locked → on submit `RegisteredUserController` auto-accepts the invitation and redirects to the group page
3. Pending invitations appear inline below confirmed members in Groups/Show (with cancel button)
4. Re-inviting the same email replaces any existing pending invitation atomically

### Google Calendar Sync

- `SyncTaskToCalendar` job dispatched on task create/update with dates
- `RemoveCalendarEvent` job dispatched on task delete/complete
- `GoogleCalendarService` handles OAuth token refresh, event CRUD

---

## 11. Styling

**Tailwind CSS v4** via `@tailwindcss/vite` (no tailwind.config.js). Custom tokens in `resources/css/app.css`:

```
--color-primary: #2563eb     --color-bg: #ffffff
--color-primary-light: #3b82f6  --color-bg-secondary: #f9fafb
--color-primary-dark: #1d4ed8   --color-bg-tertiary: #f3f4f6
--color-border: #e5e7eb         --color-text: #111827
--color-sidebar: #f9fafb        --color-text-secondary: #6b7280
--color-sidebar-hover: #f3f4f6  --color-text-tertiary: #9ca3af
--color-sidebar-active: #eff6ff --color-success/warning/danger: green/amber/red
--font-sans: 'Inter'
```

Custom animations: `task-slide-in`, `task-complete`, `shrink` (undo toast progress), `sidebar-slide-in`, `overlay-fade-in`.

`cn()` utility = `clsx` + `tailwind-merge`. CVA used in Button + Badge.

---

## 12. TypeScript Types

Defined in `resources/js/types/index.d.ts`:

- `User`, `Task`, `Project`, `Section`, `Heading`, `Tag`, `ChecklistItem`, `Reminder`, `RepeatRule`, `Group`, `GroupMember`, `GroupInvitation`, `SocialAccount`, `CalendarStatus`
- `Paginated<T>` (with `PaginationLinks` + `PaginationMeta`)
- `PageProps<T>` -- extends InertiaPageProps with `auth.user`, `projects`, `sections`, `groups`

---

## 13. Testing

**Stack**: Pest 3.8 + PHPUnit 11.5.3, SQLite in-memory DB (configured in `phpunit.xml`), sync queue, array mail driver.

**Run tests**:

```bash
./vendor/bin/sail artisan test
./vendor/bin/sail artisan test --filter GroupInvitation   # single suite
./vendor/bin/sail artisan test --coverage                 # with coverage report
```

**Test layout**:

```
tests/
  Unit/Models/
    GroupInvitationTest.php   # fillable, casts, relationships, isPending/isExpired/isAccepted helpers
    GroupTest.php             # fillable, relationships, soft deletes
    ProjectTest.php / TaskTest.php / SocialAccountTest.php
  Feature/
    Api/
      GroupInvitationTest.php # auth guards, send/list/cancel/accept — all edge cases
      GroupTest.php           # CRUD + remove-member + share-tasks + authorization
      TaskTest.php / ProjectTest.php / ... (all API resources)
    Auth/
      RegisterWithInvitationTest.php  # ?invitation= query param, auto-accept on register
      LoginTest.php / RegisterTest.php
    Web/
      GroupInvitationTest.php  # GET /invitations/{token} Inertia page
      PageTest.php / InboxTest.php / TodayTest.php
```

**Key patterns**:

- Feature tests use `RefreshDatabase` via `Pest.php` (applied to the whole `Feature/` directory)
- Unit model tests declare `uses(RefreshDatabase::class)` individually (Unit tests don't get it by default)
- Mail is faked with `Mail::fake()` + `Mail::assertQueued(GroupInvitationMail::class, fn($m) => ...)`
- Factory states: `GroupInvitation::factory()->pending()`, `->accepted()`, `->expired()`, `->forGroup($group)`, `->invitedBy($user)`, `->forEmail('x@y.com')`

---

## 14. OpenAPI Spec

Hand-written `openapi.yaml` at the project root (OpenAPI 3.1.0). No PHP annotation package — maintained manually.

**Covered tags**: Tasks, Projects, Sections, Tags, Checklist Items, Reminders, Headings, Groups, Group Invitations, Search, Calendar, Push Subscriptions, Connected Accounts

**Group Invitations endpoints** (added with the invitation feature):

- `GET  /groups/{groupId}/invitations` — list pending (owner only)
- `POST /groups/{groupId}/invitations` — send invite by email (owner only)
- `DELETE /groups/{groupId}/invitations/{invitationId}` — cancel invite (owner only)
- `POST /invitations/{token}/accept` — accept by token (authenticated, email must match)

**Connected Accounts endpoints**:

- `DELETE /social-accounts/{socialAccountId}` — disconnect a social account (owner only; blocked if user has no password and it's their only account)

**Schemas**: `GroupInvitation`, `CreateGroupInvitation` added alongside `Group`, `CreateGroup`, `UpdateGroup`. `SocialAccount` schema added for the Connected Accounts tag.
