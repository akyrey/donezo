import React, { useEffect, useRef, useState } from 'react';
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
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    useDraggable,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
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
import { UndoToast } from '@/components/ui/UndoToast';
import { useCompleteTaskMutation } from '@/hooks/useTasks';

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
    /** Maps to a task status context string */
    context: string;
    icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Inbox',    href: '/inbox',    context: 'inbox',    icon: Inbox    },
    { label: 'Today',    href: '/today',    context: 'today',    icon: Sun      },
    { label: 'Upcoming', href: '/upcoming', context: 'upcoming', icon: Calendar },
    { label: 'Anytime',  href: '/anytime',  context: 'anytime',  icon: Layers   },
    { label: 'Someday',  href: '/someday',  context: 'someday',  icon: Archive  },
    { label: 'Logbook',  href: '/logbook',  context: 'logbook',  icon: BookOpen },
];

/** Droppable ID helpers */
const navDropId  = (context: string) => `nav:${context}`;
const projDropId = (id: number)      => `project:${id}`;
const sectDropId = (id: number)      => `section:${id}`;

function isActive(href: string, currentUrl: string): boolean {
    return (
        currentUrl === href ||
        currentUrl.startsWith(href + '/') ||
        currentUrl.startsWith(href + '?')
    );
}

// ---------------------------------------------------------------------------
// Drop-target wrappers
// ---------------------------------------------------------------------------

function DroppableNavItem({
    item,
    currentUrl,
    isDragging,
    onNavigate,
}: {
    item: NavItem;
    currentUrl: string;
    isDragging: boolean;
    onNavigate?: () => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: navDropId(item.context) });
    const Icon = item.icon;
    const active = isActive(item.href, currentUrl);

    return (
        <Link
            ref={setNodeRef}
            href={item.href}
            onClick={onNavigate}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                    ? 'bg-sidebar-active text-primary'
                    : 'text-text-secondary hover:bg-sidebar-hover hover:text-text',
                isDragging && isOver && 'ring-2 ring-primary ring-inset bg-primary/10 text-primary',
            )}
        >
            <Icon className={cn('h-4.5 w-4.5', active || (isDragging && isOver) ? 'text-primary' : 'text-text-tertiary')} />
            {item.label}
        </Link>
    );
}

function DroppableProjectItem({
    project,
    currentUrl,
    isDragging,
    onNavigate,
}: {
    project: Project;
    currentUrl: string;
    isDragging: boolean;
    onNavigate?: () => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: projDropId(project.id) });
    const projectUrl = `/projects/${project.id}`;
    const active = isActive(projectUrl, currentUrl);

    return (
        <Link
            ref={setNodeRef}
            href={projectUrl}
            onClick={onNavigate}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                    ? 'bg-sidebar-active text-primary'
                    : 'text-text-secondary hover:bg-sidebar-hover hover:text-text',
                isDragging && isOver && 'ring-2 ring-primary ring-inset bg-primary/10 text-primary',
            )}
        >
            <FolderOpen className={cn('h-4 w-4', isDragging && isOver ? 'text-primary' : 'text-text-tertiary')} />
            <span className="truncate">{project.name}</span>
            <ChevronRight className="ml-auto h-3.5 w-3.5 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
    );
}

function DroppableSectionItem({
    section,
    isDragging,
}: {
    section: Section;
    isDragging: boolean;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: sectDropId(section.id) });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors',
                isDragging && 'cursor-copy hover:bg-sidebar-hover',
                isDragging && isOver && 'ring-2 ring-primary ring-inset bg-primary/10 text-primary',
            )}
        >
            <LayoutList className={cn('h-4 w-4', isDragging && isOver ? 'text-primary' : 'text-text-tertiary')} />
            <span className="truncate">{section.name}</span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Draggable FAB
// ---------------------------------------------------------------------------

function DraggableFab({
    onTap,
    isDragging,
}: {
    onTap: () => void;
    isDragging: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging: selfDragging } = useDraggable({ id: 'fab' });

    const style = selfDragging
        ? { opacity: 0 } // hide original while overlay is shown
        : transform
          ? { transform: CSS.Translate.toString(transform) }
          : undefined;

    return (
        <button
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onTap}
            className={cn(
                'fixed bottom-6 right-6 z-30',
                'flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg',
                'transition-colors duration-150 hover:bg-primary-dark',
                isDragging && 'cursor-grabbing',
            )}
            aria-label="New task"
        >
            <Plus className="h-6 w-6" />
        </button>
    );
}

// ---------------------------------------------------------------------------
// SidebarContent
// ---------------------------------------------------------------------------

function SidebarContent({
    currentUrl,
    projects,
    sections,
    groups,
    user,
    isDragging,
    onNavigate,
}: {
    currentUrl: string;
    projects: Project[];
    sections: Section[];
    groups: Group[];
    user: PageProps['auth']['user'];
    isDragging: boolean;
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
                    {NAV_ITEMS.map((item) => (
                        <DroppableNavItem
                            key={item.href}
                            item={item}
                            currentUrl={currentUrl}
                            isDragging={isDragging}
                            onNavigate={onNavigate}
                        />
                    ))}
                </nav>

                <Separator className="my-2" />

                {/* Projects */}
                <div className="py-2">
                    <div className="flex items-center justify-between px-3 py-1.5">
                        <Link
                            href={route('projects.index')}
                            onClick={onNavigate}
                            className="text-xs font-semibold uppercase tracking-wider text-text-tertiary hover:text-text transition-colors"
                        >
                            Projects
                        </Link>
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
                        {projects.map((project) => (
                            <DroppableProjectItem
                                key={project.id}
                                project={project}
                                currentUrl={currentUrl}
                                isDragging={isDragging}
                                onNavigate={onNavigate}
                            />
                        ))}
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
                            <DroppableSectionItem
                                key={section.id}
                                section={section}
                                isDragging={isDragging}
                            />
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
                                    <span className="truncate">{group.name}</span>
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
                    <DropdownMenuContent align="start" side="top" className="w-56">
                        <DropdownMenuItem onSelect={() => router.visit('/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => router.post('/logout')}
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

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

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
    const [isDragging, setIsDragging] = useState(false);
    const [undoTask, setUndoTask] = useState<{ id: number; title: string } | null>(null);
    const completeTaskMutation = useCompleteTaskMutation();

    useEffect(() => {
        function handleTaskCompleted(e: Event) {
            const { id, title } = (e as CustomEvent<{ id: number; title: string }>).detail;
            setUndoTask({ id, title });
        }
        window.addEventListener('task-completed', handleTaskCompleted);
        return () => window.removeEventListener('task-completed', handleTaskCompleted);
    }, []);

    // Context resolved from drag-drop target
    const [resolvedContext, setResolvedContext] = useState<string | undefined>(taskContext);
    const [resolvedProjectId, setResolvedProjectId] = useState<number | undefined>(defaultProjectId);

    // Require 8 px of movement before a drag starts so a tap still fires onClick
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    );

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

    function handleDragStart(_event: DragStartEvent) {
        setIsDragging(true);
        // Open sidebar on mobile so targets are reachable
        setSidebarOpen(true);
    }

    function handleDragEnd(event: DragEndEvent) {
        setIsDragging(false);

        const { over } = event;
        if (!over) return;

        const id = String(over.id);

        if (id.startsWith('nav:')) {
            const context = id.slice(4); // e.g. "inbox"
            // Logbook doesn't create tasks
            if (context === 'logbook') return;
            setResolvedContext(context);
            setResolvedProjectId(undefined);
        } else if (id.startsWith('project:')) {
            const projectId = Number(id.slice(8));
            setResolvedContext('project');
            setResolvedProjectId(projectId);
        } else if (id.startsWith('section:')) {
            // Sections don't have a direct task-status mapping; default to inbox
            setResolvedContext('inbox');
            setResolvedProjectId(undefined);
        } else {
            return;
        }

        setAddTaskOpen(true);
    }

    function handleFabTap() {
        // Reset to page-level defaults on a plain tap
        setResolvedContext(taskContext);
        setResolvedProjectId(defaultProjectId);
        setAddTaskOpen(true);
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-screen bg-bg-secondary">
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
                        onClick={() => { if (!isDragging) setSidebarOpen(false); }}
                    />
                )}

                {/* Sidebar */}
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
                        isDragging={isDragging}
                        onNavigate={() => setSidebarOpen(false)}
                    />
                </aside>

                {/* Main content */}
                <main className="flex flex-1 flex-col overflow-hidden">
                    {/* Top bar */}
                    <header className="flex h-14 items-center gap-3 border-b border-border-light bg-bg px-4 lg:px-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {title && (
                            <h1 className="text-lg font-semibold text-text">{title}</h1>
                        )}

                        <div className="flex-1" />

                        {/* Quick Find button */}
                        <Button
                            variant="ghost"
                            className="gap-2 text-text-secondary"
                            onClick={() => setCommandPaletteOpen(true)}
                        >
                            <Search className="h-4 w-4" />
                            <span className="hidden text-sm sm:inline">Quick Find</span>
                            <kbd className="hidden rounded border border-border bg-bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary sm:inline-block">
                                {navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl+'}K
                            </kbd>
                        </Button>
                    </header>

                    {/* Content area */}
                    <div className="flex-1 overflow-y-auto pb-24">
                        <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Draggable FAB */}
                <DraggableFab onTap={handleFabTap} isDragging={isDragging} />

                {/* Drag overlay — ghost that follows the pointer */}
                <DragOverlay dropAnimation={null}>
                    {isDragging && (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl opacity-90 scale-110">
                            <Plus className="h-6 w-6" />
                        </div>
                    )}
                </DragOverlay>

                {/* Command Palette */}
                <CommandPalette
                    open={commandPaletteOpen}
                    onOpenChange={setCommandPaletteOpen}
                />

                {/* Add Task Dialog */}
                <AddTaskDialog
                    open={addTaskOpen}
                    onOpenChange={setAddTaskOpen}
                    context={resolvedContext}
                    defaultProjectId={resolvedProjectId}
                />

                {/* Undo toast */}
                {undoTask && (
                    <UndoToast
                        message={`"${undoTask.title}" completed`}
                        onUndo={() =>
                            completeTaskMutation.mutate({
                                id: undoTask.id,
                                completed: false,
                            })
                        }
                        onDismiss={() => setUndoTask(null)}
                    />
                )}
            </div>
        </DndContext>
    );
}
