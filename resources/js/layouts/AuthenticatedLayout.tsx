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
    MoreHorizontal,
    Pencil,
    Trash2,
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
import * as Dialog from '@radix-ui/react-dialog';
import type { PageProps, Project, Section, Group } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
import { useSectionMutation, useUpdateSectionMutation, useDeleteSectionMutation } from '@/hooks/useSections';
import { useUpdateProjectMutation, useDeleteProjectMutation } from '@/hooks/useProjects';

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
    /** Whether this item supports showing an uncomplete task count badge */
    showBadge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Inbox',    href: '/inbox',    context: 'inbox',    icon: Inbox,    showBadge: true  },
    { label: 'Today',    href: '/today',    context: 'today',    icon: Sun,      showBadge: true  },
    { label: 'Upcoming', href: '/upcoming', context: 'upcoming', icon: Calendar, showBadge: true  },
    { label: 'Anytime',  href: '/anytime',  context: 'anytime',  icon: Layers,   showBadge: true  },
    { label: 'Someday',  href: '/someday',  context: 'someday',  icon: Archive,  showBadge: true  },
    { label: 'Logbook',  href: '/logbook',  context: 'logbook',  icon: BookOpen, showBadge: false },
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
    count,
}: {
    item: NavItem;
    currentUrl: string;
    isDragging: boolean;
    onNavigate?: () => void;
    count?: number;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: navDropId(item.context) });
    const Icon = item.icon;
    const active = isActive(item.href, currentUrl);
    const showCount = item.showBadge && count != null && count > 0;

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
            <Icon className={cn('h-4.5 w-4.5 shrink-0', active || (isDragging && isOver) ? 'text-primary' : 'text-text-tertiary')} />
            <span className="flex-1 truncate">{item.label}</span>
            {showCount && (
                <span className={cn(
                    'ml-auto min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-xs font-medium leading-none tabular-nums',
                    active || (isDragging && isOver)
                        ? 'bg-primary/15 text-primary'
                        : 'bg-bg-tertiary text-text-tertiary',
                )}>
                    {count}
                </span>
            )}
        </Link>
    );
}

function DroppableProjectItem({
    project,
    currentUrl,
    isDragging,
    onNavigate,
    onAction,
}: {
    project: Project;
    currentUrl: string;
    isDragging: boolean;
    onNavigate?: () => void;
    onAction: (action: 'rename' | 'delete', project: Project) => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: projDropId(project.id) });
    const projectUrl = `/projects/${project.id}`;
    const active = isActive(projectUrl, currentUrl);
    const incompleteCount = project.task_count - project.completed_task_count;
    const showCount = incompleteCount > 0;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'group/item flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                    ? 'bg-sidebar-active text-primary'
                    : 'text-text-secondary hover:bg-sidebar-hover hover:text-text',
                isDragging && isOver && 'ring-2 ring-primary ring-inset bg-primary/10 text-primary',
            )}
        >
            <Link
                href={projectUrl}
                onClick={onNavigate}
                className="flex flex-1 items-center gap-3 min-w-0"
            >
                <FolderOpen className={cn('h-4 w-4 shrink-0', isDragging && isOver ? 'text-primary' : 'text-text-tertiary')} />
                <span className="flex-1 truncate">{project.name}</span>
            </Link>
            {/* Fixed-size slot: shows badge at rest, three-dot button on hover (desktop) or always (mobile) */}
            <div className="relative h-5 w-5 shrink-0">
                {showCount && (
                    <span className={cn(
                        'absolute inset-0 hidden lg:flex items-center justify-center rounded-full text-xs font-medium leading-none tabular-nums lg:group-hover/item:invisible',
                        active || (isDragging && isOver)
                            ? 'bg-primary/15 text-primary'
                            : 'bg-bg-tertiary text-text-tertiary',
                    )}>
                        {incompleteCount}
                    </span>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={cn(
                                'absolute inset-0 flex items-center justify-center rounded text-text-tertiary hover:text-text transition-colors lg:invisible lg:group-hover/item:visible',
                                active && 'text-primary/60 hover:text-primary',
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="bottom" className="w-40">
                        <DropdownMenuItem onSelect={() => onAction('rename', project)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => onAction('delete', project)}
                            className="text-danger focus:text-danger"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

function DroppableSectionItem({
    section,
    isDragging,
    onAction,
}: {
    section: Section;
    isDragging: boolean;
    onAction: (action: 'rename' | 'delete', section: Section) => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: sectDropId(section.id) });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'group/item flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors',
                isDragging && 'cursor-copy hover:bg-sidebar-hover',
                isDragging && isOver && 'ring-2 ring-primary ring-inset bg-primary/10 text-primary',
                !isDragging && 'hover:bg-sidebar-hover hover:text-text',
            )}
        >
            <LayoutList className={cn('h-4 w-4 shrink-0', isDragging && isOver ? 'text-primary' : 'text-text-tertiary')} />
            <span className="flex-1 truncate">{section.name}</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="lg:invisible flex h-5 w-5 shrink-0 items-center justify-center rounded text-text-tertiary hover:text-text transition-colors lg:group-hover/item:visible"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom" className="w-40">
                    <DropdownMenuItem onSelect={() => onAction('rename', section)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={() => onAction('delete', section)}
                        className="text-danger focus:text-danger"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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
// Add Section Dialog
// ---------------------------------------------------------------------------

function AddSectionDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const createSection = useSectionMutation();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Section name is required.');
            return;
        }

        createSection.mutate(
            { name: name.trim() },
            {
                onSuccess: () => {
                    setName('');
                    setError('');
                    onOpenChange(false);
                },
                onError: (err: unknown) => {
                    const axiosError = err as { response?: { data?: { errors?: { name?: string[] }; message?: string } } };
                    const message =
                        axiosError.response?.data?.errors?.name?.[0] ??
                        axiosError.response?.data?.message ??
                        'Failed to create section.';
                    setError(message);
                },
            },
        );
    }

    return (
        <Dialog.Root open={open} onOpenChange={(value) => {
            if (!value) {
                setName('');
                setError('');
            }
            onOpenChange(value);
        }}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-bg text-text p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <Dialog.Title className="text-lg font-semibold text-text">
                        New Section
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-text-secondary">
                        Create a new section to group your projects.
                    </Dialog.Description>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <Input
                            label="Section name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={error}
                            placeholder="e.g., Work, Personal"
                            autoFocus
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Dialog.Close asChild>
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={createSection.isPending}>
                                {createSection.isPending
                                    ? 'Creating...'
                                    : 'Create Section'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// ---------------------------------------------------------------------------
// Rename Dialog
// ---------------------------------------------------------------------------

function RenameDialog({
    open,
    onOpenChange,
    currentName,
    entityType,
    onRename,
    isPending,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentName: string;
    entityType: 'project' | 'section';
    onRename: (name: string) => void;
    isPending: boolean;
}) {
    const [name, setName] = useState(currentName);
    const [error, setError] = useState('');

    // Sync local name when the dialog opens with a different entity
    useEffect(() => {
        if (open) {
            setName(currentName);
            setError('');
        }
    }, [open, currentName]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Name is required.');
            return;
        }

        onRename(name.trim());
    }

    const label = entityType === 'project' ? 'Project' : 'Section';

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-bg text-text p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <Dialog.Title className="text-lg font-semibold text-text">
                        Rename {label}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-text-secondary">
                        Enter a new name for this {entityType}.
                    </Dialog.Description>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <Input
                            label={`${label} name`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={error}
                            autoFocus
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Dialog.Close asChild>
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// ---------------------------------------------------------------------------
// Delete Confirm Dialog
// ---------------------------------------------------------------------------

function DeleteConfirmDialog({
    open,
    onOpenChange,
    entityName,
    entityType,
    onConfirm,
    isPending,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityName: string;
    entityType: 'project' | 'section';
    onConfirm: () => void;
    isPending: boolean;
}) {
    const label = entityType === 'project' ? 'project' : 'section';

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-bg text-text p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <Dialog.Title className="text-lg font-semibold text-text">
                        Delete {entityType === 'project' ? 'Project' : 'Section'}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-text-secondary">
                        Are you sure you want to delete <span className="font-medium text-text">{entityName}</span>?
                        {entityType === 'project'
                            ? ' The project and its headings will be removed. Tasks will be kept but unassigned from the project.'
                            : ' Projects and tasks in this section will be kept but unassigned from the section.'}
                    </Dialog.Description>

                    <div className="mt-6 flex justify-end gap-3">
                        <Dialog.Close asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isPending}
                        >
                            {isPending ? 'Deleting...' : `Delete ${label}`}
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
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
    taskCounts,
    onAddSection,
    onProjectAction,
    onSectionAction,
}: {
    currentUrl: string;
    projects: Project[];
    sections: Section[];
    groups: Group[];
    user: PageProps['auth']['user'];
    isDragging: boolean;
    onNavigate?: () => void;
    taskCounts: PageProps['task_counts'];
    onAddSection: () => void;
    onProjectAction: (action: 'rename' | 'delete', project: Project) => void;
    onSectionAction: (action: 'rename' | 'delete', section: Section) => void;
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
                            count={taskCounts[item.context as keyof typeof taskCounts]}
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
                                onAction={onProjectAction}
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
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-text-tertiary hover:text-text"
                            onClick={onAddSection}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <div className="space-y-0.5">
                        {sections.map((section) => (
                            <DroppableSectionItem
                                key={section.id}
                                section={section}
                                isDragging={isDragging}
                                onAction={onSectionAction}
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
                                    .map((n: string) => n[0])
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
    const { auth, task_counts: taskCounts = {}, projects = [], sections = [], groups = [] } = usePage<
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
    const [addSectionOpen, setAddSectionOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [undoTask, setUndoTask] = useState<{ id: number; title: string } | null>(null);
    const completeTaskMutation = useCompleteTaskMutation();

    // Rename / Delete dialog state
    const [renameTarget, setRenameTarget] = useState<{ id: number; name: string; type: 'project' | 'section' } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string; type: 'project' | 'section' } | null>(null);

    const updateProject = useUpdateProjectMutation();
    const deleteProject = useDeleteProjectMutation();
    const updateSection = useUpdateSectionMutation();
    const deleteSection = useDeleteSectionMutation();

    function handleProjectAction(action: 'rename' | 'delete', project: Project) {
        if (action === 'rename') {
            setRenameTarget({ id: project.id, name: project.name, type: 'project' });
        } else {
            setDeleteTarget({ id: project.id, name: project.name, type: 'project' });
        }
    }

    function handleSectionAction(action: 'rename' | 'delete', section: Section) {
        if (action === 'rename') {
            setRenameTarget({ id: section.id, name: section.name, type: 'section' });
        } else {
            setDeleteTarget({ id: section.id, name: section.name, type: 'section' });
        }
    }

    function handleRename(newName: string) {
        if (!renameTarget) return;
        const mutation = renameTarget.type === 'project' ? updateProject : updateSection;
        mutation.mutate(
            { id: renameTarget.id, name: newName },
            { onSuccess: () => setRenameTarget(null) },
        );
    }

    function handleDeleteConfirm() {
        if (!deleteTarget) return;
        const mutation = deleteTarget.type === 'project' ? deleteProject : deleteSection;
        mutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

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

    function handleDragStart(event: DragStartEvent) {
        const id = String(event.active.id);
        // Only handle FAB drags — task/heading drags inside pages are managed by
        // their own inner DndContext and should not trigger the layout sidebar.
        if (id !== 'fab') return;
        setIsDragging(true);
        // Open sidebar on mobile so drop targets are reachable
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
            <div className="flex h-screen bg-bg-secondary text-text">
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
                        taskCounts={taskCounts}
                        onAddSection={() => setAddSectionOpen(true)}
                        onProjectAction={handleProjectAction}
                        onSectionAction={handleSectionAction}
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

                {/* Add Section Dialog */}
                <AddSectionDialog
                    open={addSectionOpen}
                    onOpenChange={setAddSectionOpen}
                />

                {/* Rename Dialog */}
                <RenameDialog
                    open={renameTarget !== null}
                    onOpenChange={(open) => { if (!open) setRenameTarget(null); }}
                    currentName={renameTarget?.name ?? ''}
                    entityType={renameTarget?.type ?? 'project'}
                    onRename={handleRename}
                    isPending={updateProject.isPending || updateSection.isPending}
                />

                {/* Delete Confirm Dialog */}
                <DeleteConfirmDialog
                    open={deleteTarget !== null}
                    onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
                    entityName={deleteTarget?.name ?? ''}
                    entityType={deleteTarget?.type ?? 'project'}
                    onConfirm={handleDeleteConfirm}
                    isPending={deleteProject.isPending || deleteSection.isPending}
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
