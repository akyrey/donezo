import React, { useCallback, useEffect, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Inbox,
    Sun,
    Calendar,
    Layers,
    Archive,
    BookOpen,
    Plus,
    Menu,
    X,
    Settings,
    LogOut,
    ChevronRight,
    FolderOpen,
    LayoutList,
    Search,
    Users,
} from 'lucide-react';
import type { PageProps, Project, Section, Group } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Separator } from '@/components/ui/Separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { CommandPalette } from '@/components/CommandPalette';
import { AddTaskDialog } from '@/components/tasks/AddTaskDialog';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    title?: string;
    /** Context hint for new tasks created via the + button (e.g. "inbox", "today") */
    taskContext?: string;
    /** Pre-select a project when creating a new task */
    defaultProjectId?: number;
}

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'Today', href: '/today', icon: Sun },
    { label: 'Upcoming', href: '/upcoming', icon: Calendar },
    { label: 'Anytime', href: '/anytime', icon: Layers },
    { label: 'Someday', href: '/someday', icon: Archive },
    { label: 'Logbook', href: '/logbook', icon: BookOpen },
];

function isActive(href: string, currentUrl: string): boolean {
    // Match exact or with trailing slash / query params
    return (
        currentUrl === href ||
        currentUrl.startsWith(href + '/') ||
        currentUrl.startsWith(href + '?')
    );
}

function SidebarContent({
    currentUrl,
    projects,
    sections,
    groups,
    user,
    onNavigate,
}: {
    currentUrl: string;
    projects: Project[];
    sections: Section[];
    groups: Group[];
    user: PageProps['auth']['user'];
    onNavigate?: () => void;
}) {
    return (
        <div className="flex h-full flex-col">
            {/* App name */}
            <div className="flex h-14 items-center px-5">
                <Link
                    href="/"
                    className="text-lg font-bold tracking-tight text-text"
                    onClick={onNavigate}
                >
                    Donezo
                </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3">
                <nav className="space-y-0.5 py-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href, currentUrl);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-sidebar-active text-primary'
                                        : 'text-text-secondary hover:bg-sidebar-hover hover:text-text',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'h-4.5 w-4.5',
                                        active
                                            ? 'text-primary'
                                            : 'text-text-tertiary',
                                    )}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <Separator className="my-2" />

                {/* Projects */}
                <div className="py-2">
                    <div className="flex items-center justify-between px-3 py-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                            Projects
                        </span>
                        <Link href="/projects/create" onClick={onNavigate}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-text-tertiary hover:text-text"
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-0.5">
                        {projects.map((project) => {
                            const projectUrl = `/projects/${project.id}`;
                            const active = isActive(projectUrl, currentUrl);
                            return (
                                <Link
                                    key={project.id}
                                    href={projectUrl}
                                    onClick={onNavigate}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                        active
                                            ? 'bg-sidebar-active text-primary'
                                            : 'text-text-secondary hover:bg-sidebar-hover hover:text-text',
                                    )}
                                >
                                    <FolderOpen className="h-4 w-4 text-text-tertiary" />
                                    <span className="truncate">
                                        {project.name}
                                    </span>
                                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
                                </Link>
                            );
                        })}
                        {projects.length === 0 && (
                            <p className="px-3 py-2 text-xs text-text-tertiary">
                                No projects yet
                            </p>
                        )}
                    </div>
                </div>

                <Separator className="my-2" />

                {/* Sections */}
                <div className="py-2">
                    <div className="flex items-center justify-between px-3 py-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                            Sections
                        </span>
                    </div>
                    <div className="space-y-0.5">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary"
                            >
                                <LayoutList className="h-4 w-4 text-text-tertiary" />
                                <span className="truncate">
                                    {section.name}
                                </span>
                            </div>
                        ))}
                        {sections.length === 0 && (
                            <p className="px-3 py-2 text-xs text-text-tertiary">
                                No sections yet
                            </p>
                        )}
                    </div>
                </div>

                <Separator className="my-2" />

                {/* Groups */}
                <div className="py-2">
                    <div className="flex items-center justify-between px-3 py-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                            Groups
                        </span>
                        <Link href="/groups" onClick={onNavigate}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-text-tertiary hover:text-text"
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-0.5">
                        {groups.map((group) => {
                            const groupUrl = `/groups/${group.id}`;
                            const active = isActive(groupUrl, currentUrl);
                            return (
                                <Link
                                    key={group.id}
                                    href={groupUrl}
                                    onClick={onNavigate}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                        active
                                            ? 'bg-sidebar-active text-primary'
                                            : 'text-text-secondary hover:bg-sidebar-hover hover:text-text',
                                    )}
                                >
                                    <Users className="h-4 w-4 text-text-tertiary" />
                                    <span className="truncate">
                                        {group.name}
                                    </span>
                                </Link>
                            );
                        })}
                        {groups.length === 0 && (
                            <p className="px-3 py-2 text-xs text-text-tertiary">
                                No groups yet
                            </p>
                        )}
                    </div>
                </div>
            </ScrollArea>

            {/* User menu */}
            <div className="border-t border-border p-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-hover">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                                {user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2)}
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <p className="truncate text-sm font-medium text-text">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-text-tertiary">
                                    {user.email}
                                </p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        side="top"
                        className="w-56"
                    >
                        <DropdownMenuItem
                            onSelect={() => router.visit('/settings')}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() =>
                                router.post('/logout')
                            }
                            className="text-danger focus:text-danger"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({
    children,
    title,
    taskContext,
    defaultProjectId,
}: AuthenticatedLayoutProps) {
    const { auth, projects = [], sections = [], groups = [] } = usePage<
        PageProps<{
            projects: Project[];
            sections: Section[];
            groups: Group[];
        }>
    >().props;

    const currentUrl = usePage().url;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const [addTaskOpen, setAddTaskOpen] = useState(false);

    // Global Cmd+K / Ctrl+K shortcut
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen((prev) => !prev);
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex h-screen bg-bg-secondary">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - mobile drawer */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-sidebar transition-transform duration-250 ease-in-out lg:static lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Mobile close button */}
                <div className="absolute right-2 top-3 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="h-8 w-8 text-text-tertiary"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <SidebarContent
                    currentUrl={currentUrl}
                    projects={projects}
                    sections={sections}
                    groups={groups}
                    user={auth.user}
                    onNavigate={() => setSidebarOpen(false)}
                />
            </aside>

            {/* Main content */}
            <main className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-14 items-center gap-3 border-b border-border-light bg-bg px-4 lg:px-6">
                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {title && (
                        <h1 className="text-lg font-semibold text-text">
                            {title}
                        </h1>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Quick Find button */}
                    <Button
                        variant="ghost"
                        className="gap-2 text-text-secondary"
                        onClick={() => setCommandPaletteOpen(true)}
                    >
                        <Search className="h-4 w-4" />
                        <span className="hidden text-sm sm:inline">
                            Quick Find
                        </span>
                        <kbd className="hidden rounded border border-border bg-bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary sm:inline-block">
                            {navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl+'}K
                        </kbd>
                    </Button>

                </header>

                {/* Content area — leave room at bottom for the FAB */}
                <div className="flex-1 overflow-y-auto pb-24">
                    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
                        {children}
                    </div>
                </div>
            </main>

            {/* FAB — bottom-right on all screen sizes */}
            <button
                onClick={() => setAddTaskOpen(true)}
                className={cn(
                    'fixed bottom-6 right-6 z-30',
                    'flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg',
                    'transition-transform duration-150 active:scale-95 hover:bg-primary-dark',
                )}
                aria-label="New task"
            >
                <Plus className="h-6 w-6" />
            </button>

            {/* Command Palette */}
            <CommandPalette
                open={commandPaletteOpen}
                onOpenChange={setCommandPaletteOpen}
            />

            {/* Add Task Dialog */}
            <AddTaskDialog
                open={addTaskOpen}
                onOpenChange={setAddTaskOpen}
                context={taskContext}
                defaultProjectId={defaultProjectId}
            />
        </div>
    );
}
