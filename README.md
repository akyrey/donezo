# Donezo

A full-featured task management web application inspired by [Things 3](https://culturedcode.com/things/) by Cultured
Code. Built with Laravel 12, Inertia.js, React, and PostgreSQL.

## Tech Stack

### Backend

- **PHP 8.5** / **Laravel 12**
- **PostgreSQL 16** — primary database
- **Redis 7** — sessions, cache, queues
- **Laravel Sanctum** — API token authentication
- **Laravel Socialite** — Google & GitHub OAuth
- **Spatie Laravel Data** — DTOs with validation
- **Laravel Octane** — high-performance app server
- **Pest PHP** — testing framework

### Frontend

- **React 19** with **TypeScript**
- **Inertia.js** — server-driven SPA
- **Tailwind CSS v4**
- **Radix UI** — accessible component primitives
- **TanStack React Query** — client-side data fetching & mutations
- **Lucide React** — icons
- **date-fns** — date utilities
- **react-markdown** + **remark-gfm** — markdown rendering

### Infrastructure

- **Laravel Sail** — Docker-based local development
- **Vite 7** — frontend build tooling
- **Mailpit** — local email testing
- **Laravel Telescope** — debugging dashboard
- **Laravel Debugbar** — request profiling
- **Larastan** — static analysis
- **Laravel Pint** — code formatting

## Features

### Task Management

- Create, edit, and organize tasks with titles and markdown descriptions
- Optional due dates with time support
- Repeatable/recurring tasks
- Multiple reminders per task
- Checklist items (subtasks) with toggle completion
- Tag system for flexible categorization
- Task reordering via drag positions

### Navigation (Things 3-inspired)

- **Inbox** — unsorted tasks for quick capture
- **Today** — tasks due today, with a "This Evening" split
- **Upcoming** — calendar view of future tasks
- **Anytime** — tasks without a specific schedule
- **Someday** — tasks deferred for later
- **Logbook** — completed and cancelled tasks

### Organization

- **Sections** — top-level organizational areas (similar to Things' "Areas")
- **Projects** — group related tasks under a project
- **Headings** — subdivide projects into logical groups
- **Tags** — cross-cutting labels applicable to any task

### Groups (Shared Workspaces)

- Create groups and invite members by email
- Share tasks with group members
- Owner-only management for group settings and membership

### Integrations

- **Google Calendar** — sync tasks with calendar events (OAuth-based)
- **Push Notifications** — browser push via Web Push protocol (VAPID)
- **RESTful API** — full CRUD API with Sanctum tokens for external tools

### Authentication

- Email/password registration and login (Breeze-style)
- Social login via Google and GitHub (Laravel Socialite)
- API token authentication via Laravel Sanctum

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js v22+ (for local TypeScript checks)

> PHP and Composer are **not** required locally. All PHP commands run inside the Sail Docker container.

## Getting Started

### 1. Clone and configure

```bash
git clone <repository-url> donezo
cd donezo
cp .env.example .env
```

### 2. Install dependencies and start services

```bash
# Install PHP dependencies (first run bootstraps Sail)
docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v "$(pwd):/var/www/html" \
  -w /var/www/html \
  laravelsail/php85-composer:latest \
  composer install --ignore-platform-reqs

# Start containers
./vendor/bin/sail up -d

# Generate app key
./vendor/bin/sail artisan key:generate

# Run migrations
./vendor/bin/sail artisan migrate

# Install frontend dependencies
./vendor/bin/sail npm install

# Build frontend assets
./vendor/bin/sail npm run build
```

### 3. Access the application

- **App**: http://localhost
- **Mailpit**: http://localhost:8025
- **Vite dev server**: http://localhost:5173

## Development

### Running the dev server

```bash
# Start all services (app, queue, logs, vite) concurrently
./vendor/bin/sail up -d
./vendor/bin/sail npm run dev
```

### Common commands

```bash
# Run tests
./vendor/bin/sail test

# Run tests with coverage
./vendor/bin/sail php artisan test --coverage

# Code formatting (Pint)
./vendor/bin/sail composer pint

# Static analysis (Larastan)
./vendor/bin/sail composer stan

# TypeScript type checking
npx tsc --noEmit

# Generate IDE helper files
./vendor/bin/sail artisan ide-helper:generate
./vendor/bin/sail artisan ide-helper:models --nowrite
```

### Docker services

| Service  | Port | Description                |
|----------|------|----------------------------|
| App      | 80   | Laravel application        |
| Vite     | 5173 | Frontend dev server        |
| Postgres | 5432 | Database                   |
| Redis    | 6379 | Cache, sessions, queues    |
| Mailpit  | 8025 | Email testing dashboard    |
| MinIO    | 9000 | S3-compatible object store |

## API

All API endpoints are under `/api/v1/` and require Sanctum authentication.

The full API specification is available as an [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) document at [
`openapi.yaml`](openapi.yaml).

### Resources

| Endpoint                                | Methods          | Description            |
|-----------------------------------------|------------------|------------------------|
| `/api/v1/tasks`                         | GET, POST        | List/create tasks      |
| `/api/v1/tasks/{task}`                  | GET, PUT, DELETE | Read/update/delete     |
| `/api/v1/tasks/{task}/complete`         | POST             | Mark complete          |
| `/api/v1/tasks/{task}/uncomplete`       | POST             | Mark incomplete        |
| `/api/v1/tasks/reorder`                 | POST             | Reorder tasks          |
| `/api/v1/projects`                      | GET, POST        | List/create projects   |
| `/api/v1/projects/{project}`            | GET, PUT, DELETE | Read/update/delete     |
| `/api/v1/sections`                      | GET, POST        | List/create sections   |
| `/api/v1/sections/{section}`            | GET, PUT, DELETE | Read/update/delete     |
| `/api/v1/tags`                          | GET, POST        | List/create tags       |
| `/api/v1/tags/{tag}`                    | GET, PUT, DELETE | Read/update/delete     |
| `/api/v1/tasks/{task}/checklist-items`  | GET, POST        | List/create items      |
| `/api/v1/checklist-items/{item}`        | GET, PUT, DELETE | Read/update/delete     |
| `/api/v1/checklist-items/{item}/toggle` | POST             | Toggle completion      |
| `/api/v1/tasks/{task}/reminders`        | GET, POST        | List/create reminders  |
| `/api/v1/reminders/{reminder}`          | GET, PUT, DELETE | Read/update/delete     |
| `/api/v1/projects/{project}/headings`   | GET, POST        | List/create headings   |
| `/api/v1/headings/{heading}`            | GET, PUT, DELETE | Read/update/delete     |
| `/api/v1/headings/reorder`              | POST             | Reorder headings       |
| `/api/v1/groups`                        | GET, POST        | List/create groups     |
| `/api/v1/groups/{group}`                | GET, PUT, DELETE | Read/update/delete     |
| `/api/v1/groups/{group}/members`        | POST             | Add member             |
| `/api/v1/groups/{group}/members/{user}` | DELETE           | Remove member          |
| `/api/v1/groups/{group}/tasks`          | POST             | Share tasks            |
| `/api/v1/search?q=`                     | GET              | Search across entities |
| `/api/v1/calendar/status`               | GET              | Calendar sync status   |
| `/api/v1/calendar/disconnect`           | POST             | Disconnect calendar    |
| `/api/v1/calendar/sync`                 | POST             | Sync tasks to calendar |
| `/api/v1/push-subscriptions`            | POST, DELETE     | Manage push subs       |
| `/api/v1/push-subscriptions/vapid-key`  | GET              | Get VAPID public key   |

## Environment Variables

Key variables to configure in `.env`:

| Variable                  | Description                              |
|---------------------------|------------------------------------------|
| `DB_*`                    | PostgreSQL connection settings           |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID                   |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret               |
| `GITHUB_CLIENT_ID`        | GitHub OAuth client ID                   |
| `GITHUB_CLIENT_SECRET`    | GitHub OAuth client secret               |
| `GOOGLE_CALENDAR_ENABLED` | Enable Google Calendar integration       |
| `VAPID_PUBLIC_KEY`        | VAPID key for push notifications         |
| `VAPID_PRIVATE_KEY`       | VAPID private key for push notifications |
| `TELESCOPE_ENABLED`       | Enable Laravel Telescope                 |

## Project Structure

```
app/
  Http/Controllers/
    Api/V1/          # RESTful API controllers
    Web/             # Inertia page controllers
    Auth/            # Authentication controllers
  Models/            # Eloquent models (11 models)
  Data/              # Spatie Laravel Data DTOs
  Jobs/              # Queue jobs (calendar sync, etc.)
  Console/Commands/  # Artisan commands (reminders, etc.)

resources/js/
  pages/             # Inertia page components
    Auth/            # Login, Register
    Groups/          # Group index & show
    Projects/        # Project show
    Sections/        # Section show
    Settings/        # Settings with calendar & notifications
  components/        # Reusable React components
    tasks/           # Task list, task item, task form
    ui/              # Base UI components (Radix-based)
  hooks/             # React Query hooks (useTasks, useProjects, etc.)
  lib/               # Utilities (cn, axios, etc.)
  types/             # TypeScript type definitions

database/
  migrations/        # 17 migration files
  factories/         # 11 model factories
  seeders/           # Database seeders

tests/
  Feature/
    Api/             # API endpoint tests
    Web/             # Inertia page tests
    Auth/            # Authentication tests
  Unit/
    Models/          # Model unit tests
```

## Design

The UI follows Things 3 design principles:

- Clean white backgrounds with subtle gray accents
- Blue accent color (`#2563eb`) for primary actions
- Round checkboxes for task completion
- Spacious padding and Inter font
- Collapsible sidebar navigation (drawer on mobile)
- Smooth transitions and animations
- Custom semantic color tokens for consistent theming

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
